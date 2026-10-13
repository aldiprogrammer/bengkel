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

export default function KategoriIndex({ kategori = [] }) {
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [search, setSearch] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterAbjad, setFilterAbjad] = useState('');

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
        kode_kategori: '',
        nama_kategori: '',
    });

    const nextKode = () => {
        const max = kategori.reduce((highest, item) => {
            const value = parseInt(
                String(item.kode_kategori ?? '').replace(/\D/g, ''),
                10,
            );

            return Number.isNaN(value) ? highest : Math.max(highest, value);
        }, 0);

        return `KAT-${String(max + 1).padStart(4, '0')}`;
    };

    const openCreate = () => {
        clearErrors();
        setEditing(null);
        setData({ kode_kategori: nextKode(), nama_kategori: '' });
        setFormOpen(true);
    };

    const openEdit = (row) => {
        clearErrors();
        setEditing(row);
        setData({
            kode_kategori: row.kode_kategori,
            nama_kategori: row.nama_kategori,
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
            put(`/kategori/${editing.id}`, options);
        } else {
            post('/kategori', options);
        }
    };

    const confirmDelete = () => {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/kategori/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const keyword = search.trim().toLowerCase();
    const activeFilterCount = filterAbjad ? 1 : 0;

    const abjadOptions = [
        ...new Set(
            kategori
                .map((row) => String(row.nama_kategori ?? '').charAt(0))
                .filter((letter) => /[a-zA-Z]/.test(letter))
                .map((letter) => letter.toUpperCase()),
        ),
    ].sort();

    const filteredKategori = kategori.filter((row) => {
        const matchesKeyword =
            !keyword ||
            [row.kode_kategori, row.nama_kategori]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(keyword),
                );

        const matchesAbjad =
            !filterAbjad ||
            String(row.nama_kategori ?? '')
                .charAt(0)
                .toUpperCase() === filterAbjad;

        return matchesKeyword && matchesAbjad;
    });

    const columns = [
        {
            key: 'kode_kategori',
            label: 'Kode Kategori',
            render: (row) => (
                <span className="inline-flex items-center rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                    {row.kode_kategori}
                </span>
            ),
        },
        {
            key: 'nama_kategori',
            label: 'Nama Kategori',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                        <Icon name="folder" className="h-5 w-5" />
                    </span>
                    <span className="font-medium text-slate-800">
                        {row.nama_kategori}
                    </span>
                </div>
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
                        aria-label="Edit kategori"
                    >
                        <Icon name="edit" className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setDeleteTarget(row)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Hapus kategori"
                    >
                        <Icon name="trash" className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Kategori" />

            <PageHeader
                title="Kategori"
                description="Kelola kategori produk dan barang bengkel."
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
                    Tambah Kategori
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
                        placeholder="Cari kode atau nama kategori..."
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
                                        Abjad Awal
                                    </span>
                                    <select
                                        value={filterAbjad}
                                        onChange={(event) =>
                                            setFilterAbjad(event.target.value)
                                        }
                                        className={`${inputClass} border-slate-200 focus:border-brand-500`}
                                    >
                                        <option value="">Semua Abjad</option>
                                        {abjadOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <div className="mt-4 flex justify-between gap-2 border-t border-slate-100 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setFilterAbjad('')}
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
                rows={filteredKategori}
                emptyMessage={
                    keyword || activeFilterCount > 0
                        ? 'Tidak ada kategori yang cocok dengan pencarian atau filter.'
                        : 'Belum ada data kategori.'
                }
            />

            <Modal
                open={formOpen}
                onClose={closeForm}
                title={editing ? 'Edit Kategori' : 'Tambah Kategori'}
                description={
                    editing
                        ? 'Perbarui data kategori di bawah ini.'
                        : 'Lengkapi data kategori baru di bawah ini.'
                }
            >
                <form onSubmit={submit} className="space-y-4">
                    <Field label="Kode Kategori" error={errors.kode_kategori}>
                        <input
                            type="text"
                            value={data.kode_kategori}
                            onChange={(event) =>
                                setData('kode_kategori', event.target.value)
                            }
                            placeholder="KAT-0001"
                            className={`${inputClass} ${
                                errors.kode_kategori
                                    ? 'border-rose-400 focus:border-rose-500'
                                    : 'border-slate-200 focus:border-brand-500'
                            }`}
                        />
                    </Field>

                    <Field label="Nama Kategori" error={errors.nama_kategori}>
                        <input
                            type="text"
                            value={data.nama_kategori}
                            onChange={(event) =>
                                setData('nama_kategori', event.target.value)
                            }
                            placeholder="Contoh: Pelumas"
                            className={`${inputClass} ${
                                errors.nama_kategori
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
                            {editing ? 'Simpan Perubahan' : 'Simpan Kategori'}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                title="Hapus Kategori"
                maxWidth="max-w-md"
            >
                <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                        <Icon name="alert" className="h-6 w-6" />
                    </span>
                    <p className="text-sm text-slate-600">
                        Yakin ingin menghapus kategori{' '}
                        <span className="font-semibold text-slate-800">
                            {deleteTarget?.nama_kategori}
                        </span>{' '}
                        ({deleteTarget?.kode_kategori})? Tindakan ini tidak dapat
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

KategoriIndex.layout = (page) => (
    <AdminLayout title="Kategori">{page}</AdminLayout>
);
