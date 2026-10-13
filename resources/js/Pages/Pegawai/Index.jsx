import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import PageHeader from '../../Components/PageHeader';
import DataTable from '../../Components/DataTable';
import Modal from '../../Components/Modal';
import StatusBadge from '../../Components/StatusBadge';
import Icon from '../../Components/Icons';

const jabatanOptions = ['Mekanik', 'Kasir', 'Administrasi', 'Kepala Bengkel'];
const statusOptions = ['Aktif', 'Nonaktif'];

const inputClass =
    'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20';

const today = () => new Date().toISOString().slice(0, 10);

const formatDate = (value) => {
    if (!value) {
        return '-';
    }

    const [year, month, day] = String(value).split('-');

    if (!year || !month || !day) {
        return value;
    }

    return `${day}/${month}/${year}`;
};

function Field({ label, error, children }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {label}
            </span>
            {children}
            {error && (
                <span className="mt-1 block text-xs font-medium text-rose-600">
                    {error}
                </span>
            )}
        </label>
    );
}

export default function PegawaiIndex({ pegawai = [] }) {
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [search, setSearch] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterJabatan, setFilterJabatan] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        kode_pegawai: '',
        nama: '',
        jabatan: 'Mekanik',
        no_hp: '',
        email: '',
        alamat: '',
        tanggal_masuk: today(),
        status: 'Aktif',
    });

    const nextKode = () => {
        const max = pegawai.reduce((highest, item) => {
            const value = parseInt(
                String(item.kode_pegawai ?? '').replace(/\D/g, ''),
                10,
            );

            return Number.isNaN(value) ? highest : Math.max(highest, value);
        }, 0);

        return `PEG-${String(max + 1).padStart(4, '0')}`;
    };

    const openCreate = () => {
        clearErrors();
        setEditing(null);
        setData({
            kode_pegawai: nextKode(),
            nama: '',
            jabatan: 'Mekanik',
            no_hp: '',
            email: '',
            alamat: '',
            tanggal_masuk: today(),
            status: 'Aktif',
        });
        setFormOpen(true);
    };

    const openEdit = (row) => {
        clearErrors();
        setEditing(row);
        setData({
            kode_pegawai: row.kode_pegawai,
            nama: row.nama,
            jabatan: row.jabatan,
            no_hp: row.no_hp,
            email: row.email ?? '',
            alamat: row.alamat,
            tanggal_masuk: row.tanggal_masuk,
            status: row.status,
        });
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditing(null);
        reset();
    };

    const submit = (event) => {
        event.preventDefault();

        const options = { onSuccess: () => closeForm() };

        if (editing) {
            put(`/pegawai/${editing.id}`, options);
        } else {
            post('/pegawai', options);
        }
    };

    const confirmDelete = () => {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/pegawai/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const errorClass = (field) =>
        errors[field]
            ? 'border-rose-400 focus:border-rose-500'
            : 'border-slate-200 focus:border-brand-500';

    const keyword = search.trim().toLowerCase();
    const activeFilterCount = [filterJabatan, filterStatus].filter(
        Boolean,
    ).length;

    const filteredPegawai = pegawai.filter((row) => {
        const matchesKeyword =
            !keyword ||
            [row.kode_pegawai, row.nama, row.jabatan, row.no_hp, row.email]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(keyword),
                );

        const matchesJabatan = !filterJabatan || row.jabatan === filterJabatan;
        const matchesStatus = !filterStatus || row.status === filterStatus;

        return matchesKeyword && matchesJabatan && matchesStatus;
    });

    const resetFilter = () => {
        setFilterJabatan('');
        setFilterStatus('');
    };

    const columns = [
        {
            key: 'kode_pegawai',
            label: 'Kode Pegawai',
            render: (row) => (
                <span className="inline-flex items-center rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                    {row.kode_pegawai}
                </span>
            ),
        },
        {
            key: 'nama',
            label: 'Nama',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                        {row.nama.charAt(0)}
                    </span>
                    <div className="leading-tight">
                        <span className="block font-medium text-slate-800">
                            {row.nama}
                        </span>
                        <span className="block text-xs text-slate-500">
                            {row.email ?? '-'}
                        </span>
                    </div>
                </div>
            ),
        },
        { key: 'jabatan', label: 'Jabatan' },
        {
            key: 'no_hp',
            label: 'No. HP',
            render: (row) => (
                <span className="whitespace-nowrap">{row.no_hp}</span>
            ),
        },
        {
            key: 'tanggal_masuk',
            label: 'Tanggal Masuk',
            render: (row) => (
                <span className="whitespace-nowrap text-slate-600">
                    {formatDate(row.tanggal_masuk)}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <StatusBadge tone={row.status === 'Aktif' ? 'green' : 'slate'}>
                    {row.status}
                </StatusBadge>
            ),
        },
        {
            key: 'actions',
            label: 'Aksi',
            className: 'text-right',
            render: (row) => (
                <div className="flex justify-end gap-1">
                    <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-brand-50 hover:text-brand-700"
                        aria-label="Edit pegawai"
                    >
                        <Icon name="edit" className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setDeleteTarget(row)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Hapus pegawai"
                    >
                        <Icon name="trash" className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Pegawai" />

            <PageHeader
                title="Pegawai"
                description="Kelola data pegawai bengkel Anda."
            >
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                    <Icon name="download" className="h-4 w-4" />
                    Ekspor
                </button>
                <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700"
                >
                    <Icon name="plus" className="h-4 w-4" />
                    Tambah Pegawai
                </button>
            </PageHeader>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1 sm:max-w-xs">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <Icon name="search" className="h-4 w-4" />
                    </span>
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari nama, kode, jabatan..."
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                </div>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setFilterOpen((open) => !open)}
                        className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
                            activeFilterCount > 0
                                ? 'border-brand-200 bg-brand-50 text-brand-700'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Icon name="filter" className="h-4 w-4" />
                        Filter
                        {activeFilterCount > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-semibold text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {filterOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setFilterOpen(false)}
                            />
                            <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                                <div className="space-y-3">
                                    <label className="block">
                                        <span className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Jabatan
                                        </span>
                                        <select
                                            value={filterJabatan}
                                            onChange={(event) =>
                                                setFilterJabatan(
                                                    event.target.value,
                                                )
                                            }
                                            className={`${inputClass} border-slate-200 focus:border-brand-500`}
                                        >
                                            <option value="">
                                                Semua Jabatan
                                            </option>
                                            {jabatanOptions.map((option) => (
                                                <option
                                                    key={option}
                                                    value={option}
                                                >
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="block">
                                        <span className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Status
                                        </span>
                                        <select
                                            value={filterStatus}
                                            onChange={(event) =>
                                                setFilterStatus(
                                                    event.target.value,
                                                )
                                            }
                                            className={`${inputClass} border-slate-200 focus:border-brand-500`}
                                        >
                                            <option value="">
                                                Semua Status
                                            </option>
                                            {statusOptions.map((option) => (
                                                <option
                                                    key={option}
                                                    value={option}
                                                >
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>

                                <div className="mt-4 flex justify-between gap-2 border-t border-slate-100 pt-3">
                                    <button
                                        type="button"
                                        onClick={resetFilter}
                                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-50"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFilterOpen(false)}
                                        className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
                                    >
                                        Terapkan
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <DataTable
                columns={columns}
                rows={filteredPegawai}
                emptyMessage={
                    keyword || activeFilterCount > 0
                        ? 'Tidak ada pegawai yang cocok dengan pencarian atau filter.'
                        : 'Belum ada data pegawai.'
                }
            />

            <Modal
                open={formOpen}
                onClose={closeForm}
                title={editing ? 'Edit Pegawai' : 'Tambah Pegawai'}
                description={
                    editing
                        ? 'Perbarui data pegawai di bawah ini.'
                        : 'Lengkapi data pegawai baru di bawah ini.'
                }
                maxWidth="max-w-2xl"
            >
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Kode Pegawai" error={errors.kode_pegawai}>
                            <input
                                type="text"
                                value={data.kode_pegawai}
                                onChange={(event) =>
                                    setData('kode_pegawai', event.target.value)
                                }
                                placeholder="PEG-0001"
                                className={`${inputClass} ${errorClass('kode_pegawai')}`}
                            />
                        </Field>

                        <Field label="Nama" error={errors.nama}>
                            <input
                                type="text"
                                value={data.nama}
                                onChange={(event) =>
                                    setData('nama', event.target.value)
                                }
                                placeholder="Nama pegawai"
                                className={`${inputClass} ${errorClass('nama')}`}
                            />
                        </Field>

                        <Field label="Jabatan" error={errors.jabatan}>
                            <select
                                value={data.jabatan}
                                onChange={(event) =>
                                    setData('jabatan', event.target.value)
                                }
                                className={`${inputClass} ${errorClass('jabatan')}`}
                            >
                                {jabatanOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="No. HP" error={errors.no_hp}>
                            <input
                                type="text"
                                value={data.no_hp}
                                onChange={(event) =>
                                    setData('no_hp', event.target.value)
                                }
                                placeholder="0812-3456-7890"
                                className={`${inputClass} ${errorClass('no_hp')}`}
                            />
                        </Field>

                        <Field label="Email" error={errors.email}>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(event) =>
                                    setData('email', event.target.value)
                                }
                                placeholder="pegawai@posbengkel.test"
                                className={`${inputClass} ${errorClass('email')}`}
                            />
                        </Field>

                        <Field label="Tanggal Masuk" error={errors.tanggal_masuk}>
                            <input
                                type="date"
                                value={data.tanggal_masuk}
                                onChange={(event) =>
                                    setData('tanggal_masuk', event.target.value)
                                }
                                className={`${inputClass} ${errorClass('tanggal_masuk')}`}
                            />
                        </Field>

                        <Field label="Status" error={errors.status}>
                            <select
                                value={data.status}
                                onChange={(event) =>
                                    setData('status', event.target.value)
                                }
                                className={`${inputClass} ${errorClass('status')}`}
                            >
                                {statusOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    <Field label="Alamat" error={errors.alamat}>
                        <textarea
                            rows={3}
                            value={data.alamat}
                            onChange={(event) =>
                                setData('alamat', event.target.value)
                            }
                            placeholder="Alamat lengkap pegawai"
                            className={`${inputClass} ${errorClass('alamat')}`}
                        />
                    </Field>

                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            onClick={closeForm}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {editing ? 'Simpan Perubahan' : 'Simpan Pegawai'}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                title="Hapus Pegawai"
                maxWidth="max-w-md"
            >
                <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                        <Icon name="alert" className="h-6 w-6" />
                    </span>
                    <p className="text-sm text-slate-600">
                        Yakin ingin menghapus pegawai{' '}
                        <span className="font-semibold text-slate-800">
                            {deleteTarget?.nama}
                        </span>{' '}
                        ({deleteTarget?.kode_pegawai})? Tindakan ini tidak dapat
                        dibatalkan.
                    </p>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => setDeleteTarget(null)}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={confirmDelete}
                        className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-rose-600/30 hover:bg-rose-700"
                    >
                        Hapus
                    </button>
                </div>
            </Modal>
        </>
    );
}

PegawaiIndex.layout = (page) => (
    <AdminLayout title="Pegawai">{page}</AdminLayout>
);
