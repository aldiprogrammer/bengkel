import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import PageHeader from '../../Components/PageHeader';
import DataTable from '../../Components/DataTable';
import Modal from '../../Components/Modal';
import Icon from '../../Components/Icons';

const inputClass =
    'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20';

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

export default function PelangganIndex({ pelanggan = [] }) {
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [search, setSearch] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterKendaraan, setFilterKendaraan] = useState('');

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
        kode_pelanggan: '',
        nama: '',
        no_hp: '',
        alamat: '',
        kendaraan: '',
        nomor_plat: '',
    });

    const nextKode = () => {
        const max = pelanggan.reduce((highest, item) => {
            const value = parseInt(
                String(item.kode_pelanggan ?? '').replace(/\D/g, ''),
                10,
            );

            return Number.isNaN(value) ? highest : Math.max(highest, value);
        }, 0);

        return `PLG-${String(max + 1).padStart(4, '0')}`;
    };

    const openCreate = () => {
        clearErrors();
        setEditing(null);
        setData({
            kode_pelanggan: nextKode(),
            nama: '',
            no_hp: '',
            alamat: '',
            kendaraan: '',
            nomor_plat: '',
        });
        setFormOpen(true);
    };

    const openEdit = (row) => {
        clearErrors();
        setEditing(row);
        setData({
            kode_pelanggan: row.kode_pelanggan,
            nama: row.nama,
            no_hp: row.no_hp,
            alamat: row.alamat,
            kendaraan: row.kendaraan,
            nomor_plat: row.nomor_plat,
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

        const options = {
            onSuccess: () => closeForm(),
        };

        if (editing) {
            put(`/pelanggan/${editing.id}`, options);
        } else {
            post('/pelanggan', options);
        }
    };

    const confirmDelete = () => {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/pelanggan/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const keyword = search.trim().toLowerCase();
    const activeFilterCount = filterKendaraan ? 1 : 0;

    const kendaraanOptions = [
        ...new Set(pelanggan.map((row) => row.kendaraan).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b));

    const filteredPelanggan = pelanggan.filter((row) => {
        const matchesKeyword =
            !keyword ||
            [
                row.kode_pelanggan,
                row.nama,
                row.no_hp,
                row.alamat,
                row.kendaraan,
                row.nomor_plat,
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(keyword),
                );

        const matchesKendaraan =
            !filterKendaraan || row.kendaraan === filterKendaraan;

        return matchesKeyword && matchesKendaraan;
    });

    const columns = [
        {
            key: 'kode_pelanggan',
            label: 'Kode Pelanggan',
            render: (row) => (
                <span className="inline-flex items-center rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                    {row.kode_pelanggan}
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
                    <span className="font-medium text-slate-800">
                        {row.nama}
                    </span>
                </div>
            ),
        },
        {
            key: 'no_hp',
            label: 'No. HP',
            render: (row) => (
                <span className="whitespace-nowrap">{row.no_hp}</span>
            ),
        },
        {
            key: 'alamat',
            label: 'Alamat',
            className: 'max-w-xs',
            render: (row) => (
                <span className="block max-w-xs truncate text-slate-500">
                    {row.alamat}
                </span>
            ),
        },
        { key: 'kendaraan', label: 'Kendaraan' },
        {
            key: 'nomor_plat',
            label: 'Nomor Plat',
            render: (row) => (
                <span className="inline-flex items-center whitespace-nowrap rounded-md border border-slate-900/10 bg-slate-900 px-2 py-1 text-xs font-semibold tracking-wider text-white">
                    {row.nomor_plat}
                </span>
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
                        aria-label="Edit pelanggan"
                    >
                        <Icon name="edit" className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setDeleteTarget(row)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Hapus pelanggan"
                    >
                        <Icon name="trash" className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Pelanggan" />

            <PageHeader
                title="Pelanggan"
                description="Kelola data pelanggan bengkel Anda."
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
                    Tambah Pelanggan
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
                        placeholder="Cari nama, kode, plat..."
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
                                <label className="block">
                                    <span className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Kendaraan
                                    </span>
                                    <select
                                        value={filterKendaraan}
                                        onChange={(event) =>
                                            setFilterKendaraan(
                                                event.target.value,
                                            )
                                        }
                                        className={`${inputClass} border-slate-200 focus:border-brand-500`}
                                    >
                                        <option value="">
                                            Semua Kendaraan
                                        </option>
                                        {kendaraanOptions.map((option) => (
                                            <option
                                                key={option}
                                                value={option}
                                            >
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <div className="mt-4 flex justify-between gap-2 border-t border-slate-100 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setFilterKendaraan('')}
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
                rows={filteredPelanggan}
                emptyMessage={
                    keyword || activeFilterCount > 0
                        ? 'Tidak ada pelanggan yang cocok dengan pencarian atau filter.'
                        : 'Belum ada data pelanggan.'
                }
            />

            <Modal
                open={formOpen}
                onClose={closeForm}
                title={editing ? 'Edit Pelanggan' : 'Tambah Pelanggan'}
                description={
                    editing
                        ? 'Perbarui data pelanggan di bawah ini.'
                        : 'Lengkapi data pelanggan baru di bawah ini.'
                }
                maxWidth="max-w-2xl"
            >
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                            label="Kode Pelanggan"
                            error={errors.kode_pelanggan}
                        >
                            <input
                                type="text"
                                value={data.kode_pelanggan}
                                onChange={(event) =>
                                    setData(
                                        'kode_pelanggan',
                                        event.target.value,
                                    )
                                }
                                placeholder="PLG-0001"
                                className={`${inputClass} ${
                                    errors.kode_pelanggan
                                        ? 'border-rose-400 focus:border-rose-500'
                                        : 'border-slate-200 focus:border-brand-500'
                                }`}
                            />
                        </Field>

                        <Field label="Nama" error={errors.nama}>
                            <input
                                type="text"
                                value={data.nama}
                                onChange={(event) =>
                                    setData('nama', event.target.value)
                                }
                                placeholder="Nama pelanggan"
                                className={`${inputClass} ${
                                    errors.nama
                                        ? 'border-rose-400 focus:border-rose-500'
                                        : 'border-slate-200 focus:border-brand-500'
                                }`}
                            />
                        </Field>

                        <Field label="No. HP" error={errors.no_hp}>
                            <input
                                type="text"
                                value={data.no_hp}
                                onChange={(event) =>
                                    setData('no_hp', event.target.value)
                                }
                                placeholder="0812-3456-7890"
                                className={`${inputClass} ${
                                    errors.no_hp
                                        ? 'border-rose-400 focus:border-rose-500'
                                        : 'border-slate-200 focus:border-brand-500'
                                }`}
                            />
                        </Field>

                        <Field label="Kendaraan" error={errors.kendaraan}>
                            <input
                                type="text"
                                value={data.kendaraan}
                                onChange={(event) =>
                                    setData('kendaraan', event.target.value)
                                }
                                placeholder="Toyota Avanza"
                                className={`${inputClass} ${
                                    errors.kendaraan
                                        ? 'border-rose-400 focus:border-rose-500'
                                        : 'border-slate-200 focus:border-brand-500'
                                }`}
                            />
                        </Field>

                        <Field label="Nomor Plat" error={errors.nomor_plat}>
                            <input
                                type="text"
                                value={data.nomor_plat}
                                onChange={(event) =>
                                    setData('nomor_plat', event.target.value)
                                }
                                placeholder="B 1023 XYZ"
                                className={`${inputClass} ${
                                    errors.nomor_plat
                                        ? 'border-rose-400 focus:border-rose-500'
                                        : 'border-slate-200 focus:border-brand-500'
                                }`}
                            />
                        </Field>
                    </div>

                    <Field label="Alamat" error={errors.alamat}>
                        <textarea
                            rows={3}
                            value={data.alamat}
                            onChange={(event) =>
                                setData('alamat', event.target.value)
                            }
                            placeholder="Alamat lengkap pelanggan"
                            className={`${inputClass} ${
                                errors.alamat
                                    ? 'border-rose-400 focus:border-rose-500'
                                    : 'border-slate-200 focus:border-brand-500'
                            }`}
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
                            {editing ? 'Simpan Perubahan' : 'Simpan Pelanggan'}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                title="Hapus Pelanggan"
                maxWidth="max-w-md"
            >
                <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                        <Icon name="alert" className="h-6 w-6" />
                    </span>
                    <p className="text-sm text-slate-600">
                        Yakin ingin menghapus pelanggan{' '}
                        <span className="font-semibold text-slate-800">
                            {deleteTarget?.nama}
                        </span>{' '}
                        ({deleteTarget?.kode_pelanggan})? Tindakan ini tidak
                        dapat dibatalkan.
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

PelangganIndex.layout = (page) => (
    <AdminLayout title="Pelanggan">{page}</AdminLayout>
);
