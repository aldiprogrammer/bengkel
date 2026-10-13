import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import PageHeader from '../../Components/PageHeader';
import DataTable from '../../Components/DataTable';
import Modal from '../../Components/Modal';
import Icon from '../../Components/Icons';

const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

const satuanOptions = ['Pcs', 'Lembar', 'Btl'];

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

function Field({ label, error, className = '', children }) {
    return (
        <label className={`block ${className}`}>
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

export default function ProdukIndex({ produk = [], kategori = [] }) {
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [search, setSearch] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterKategori, setFilterKategori] = useState('');
    const [filterSatuan, setFilterSatuan] = useState('');

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
        kode_produk: '',
        nama_produk: '',
        kategori_id: '',
        satuan: 'Pcs',
        stok: '',
        harga_beli: '',
        harga_jual: '',
        diskon: '',
        tanggal_masuk: today(),
    });

    const nextKode = () => {
        const max = produk.reduce((highest, item) => {
            const value = parseInt(
                String(item.kode_produk ?? '').replace(/\D/g, ''),
                10,
            );

            return Number.isNaN(value) ? highest : Math.max(highest, value);
        }, 0);

        return `BRG-${String(max + 1).padStart(4, '0')}`;
    };

    const openCreate = () => {
        clearErrors();
        setEditing(null);
        setData({
            kode_produk: nextKode(),
            nama_produk: '',
            kategori_id: kategori[0]?.id ?? '',
            satuan: 'Pcs',
            stok: '',
            harga_beli: '',
            harga_jual: '',
            diskon: '0',
            tanggal_masuk: today(),
        });
        setFormOpen(true);
    };

    const openEdit = (row) => {
        clearErrors();
        setEditing(row);
        setData({
            kode_produk: row.kode_produk,
            nama_produk: row.nama_produk,
            kategori_id: row.kategori_id,
            satuan: row.satuan,
            stok: row.stok,
            harga_beli: row.harga_beli,
            harga_jual: row.harga_jual,
            diskon: row.diskon,
            tanggal_masuk: row.tanggal_masuk,
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
            put(`/produk/${editing.id}`, options);
        } else {
            post('/produk', options);
        }
    };

    const confirmDelete = () => {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/produk/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const errorClass = (field) =>
        errors[field]
            ? 'border-rose-400 focus:border-rose-500'
            : 'border-slate-200 focus:border-brand-500';

    const keyword = search.trim().toLowerCase();
    const activeFilterCount = [filterKategori, filterSatuan].filter(
        Boolean,
    ).length;

    const filteredProduk = produk.filter((row) => {
        const matchesKeyword =
            !keyword ||
            [
                row.kode_produk,
                row.nama_produk,
                row.satuan,
                row.kategori?.nama_kategori,
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(keyword),
                );

        const matchesKategori =
            !filterKategori || String(row.kategori_id) === filterKategori;
        const matchesSatuan = !filterSatuan || row.satuan === filterSatuan;

        return matchesKeyword && matchesKategori && matchesSatuan;
    });

    const resetFilter = () => {
        setFilterKategori('');
        setFilterSatuan('');
    };

    const columns = [
        {
            key: 'kode_produk',
            label: 'Kode Barang',
            render: (row) => (
                <span className="inline-flex items-center rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                    {row.kode_produk}
                </span>
            ),
        },
        {
            key: 'nama_produk',
            label: 'Nama',
            render: (row) => (
                <span className="font-medium text-slate-800">
                    {row.nama_produk}
                </span>
            ),
        },
        {
            key: 'kategori',
            label: 'Kategori',
            render: (row) => row.kategori?.nama_kategori ?? '-',
        },
        {
            key: 'satuan',
            label: 'Satuan',
            render: (row) => (
                <span className="text-slate-600">{row.satuan}</span>
            ),
        },
        {
            key: 'stok',
            label: 'Stok',
            render: (row) => {
                const isOut = Number(row.stok) === 0;
                const isLow = Number(row.stok) > 0 && Number(row.stok) < 2;

                return (
                    <span
                        className={
                            isOut
                                ? 'font-semibold text-rose-700'
                                : isLow
                                  ? 'font-semibold text-amber-700'
                                  : 'font-semibold text-slate-700'
                        }
                    >
                        {row.stok}
                    </span>
                );
            },
        },
        {
            key: 'harga_beli',
            label: 'Harga Beli',
            render: (row) => currency.format(row.harga_beli),
        },
        {
            key: 'harga_jual',
            label: 'Harga Jual',
            render: (row) => (
                <span className="font-semibold text-slate-800">
                    {currency.format(row.harga_jual)}
                </span>
            ),
        },
        {
            key: 'diskon',
            label: 'Diskon',
            render: (row) => (
                <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                    {row.diskon}%
                </span>
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
            key: 'actions',
            label: 'Aksi',
            className: 'text-right',
            render: (row) => (
                <div className="flex justify-end gap-1">
                    <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-brand-50 hover:text-brand-700"
                        aria-label="Edit produk"
                    >
                        <Icon name="edit" className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setDeleteTarget(row)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Hapus produk"
                    >
                        <Icon name="trash" className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Produk & Stok" />

            <PageHeader
                title="Produk & Stok"
                description="Kelola sparepart, harga, dan ketersediaan stok."
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
                    Tambah Produk
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
                        placeholder="Cari produk atau kode..."
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
                                            Kategori
                                        </span>
                                        <select
                                            value={filterKategori}
                                            onChange={(event) =>
                                                setFilterKategori(
                                                    event.target.value,
                                                )
                                            }
                                            className={`${inputClass} border-slate-200 focus:border-brand-500`}
                                        >
                                            <option value="">
                                                Semua Kategori
                                            </option>
                                            {kategori.map((item) => (
                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.nama_kategori}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="block">
                                        <span className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Satuan
                                        </span>
                                        <select
                                            value={filterSatuan}
                                            onChange={(event) =>
                                                setFilterSatuan(
                                                    event.target.value,
                                                )
                                            }
                                            className={`${inputClass} border-slate-200 focus:border-brand-500`}
                                        >
                                            <option value="">
                                                Semua Satuan
                                            </option>
                                            {satuanOptions.map((option) => (
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
                rows={filteredProduk}
                emptyMessage={
                    keyword || activeFilterCount > 0
                        ? 'Tidak ada produk yang cocok dengan pencarian atau filter.'
                        : 'Belum ada data produk.'
                }
                rowClassName={(row) => {
                    const stok = Number(row.stok);

                    if (stok === 0) {
                        return 'bg-rose-50 hover:bg-rose-100';
                    }

                    if (stok < 2) {
                        return 'bg-amber-50 hover:bg-amber-100';
                    }

                    return '';
                }}
            />

            <Modal
                open={formOpen}
                onClose={closeForm}
                title={editing ? 'Edit Produk' : 'Tambah Produk'}
                description={
                    editing
                        ? 'Perbarui data produk di bawah ini.'
                        : 'Lengkapi data produk baru di bawah ini.'
                }
                maxWidth="max-w-2xl"
            >
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Kode Barang" error={errors.kode_produk}>
                            <input
                                type="text"
                                value={data.kode_produk}
                                onChange={(event) =>
                                    setData('kode_produk', event.target.value)
                                }
                                placeholder="BRG-0001"
                                className={`${inputClass} ${errorClass('kode_produk')}`}
                            />
                        </Field>

                        <Field label="Nama Produk" error={errors.nama_produk}>
                            <input
                                type="text"
                                value={data.nama_produk}
                                onChange={(event) =>
                                    setData('nama_produk', event.target.value)
                                }
                                placeholder="Contoh: Oli Mesin 10W-40"
                                className={`${inputClass} ${errorClass('nama_produk')}`}
                            />
                        </Field>

                        <Field label="Kategori" error={errors.kategori_id}>
                            <select
                                value={data.kategori_id}
                                onChange={(event) =>
                                    setData('kategori_id', event.target.value)
                                }
                                className={`${inputClass} ${errorClass('kategori_id')}`}
                            >
                                <option value="">Pilih kategori</option>
                                {kategori.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.nama_kategori}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Satuan" error={errors.satuan}>
                            <select
                                value={data.satuan}
                                onChange={(event) =>
                                    setData('satuan', event.target.value)
                                }
                                className={`${inputClass} ${errorClass('satuan')}`}
                            >
                                {satuanOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Stok" error={errors.stok}>
                            <input
                                type="number"
                                min="0"
                                value={data.stok}
                                onChange={(event) =>
                                    setData('stok', event.target.value)
                                }
                                placeholder="0"
                                className={`${inputClass} ${errorClass('stok')}`}
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

                        <Field label="Harga Beli (Rp)" error={errors.harga_beli}>
                            <input
                                type="number"
                                min="0"
                                value={data.harga_beli}
                                onChange={(event) =>
                                    setData('harga_beli', event.target.value)
                                }
                                placeholder="55000"
                                className={`${inputClass} ${errorClass('harga_beli')}`}
                            />
                        </Field>

                        <Field label="Harga Jual (Rp)" error={errors.harga_jual}>
                            <input
                                type="number"
                                min="0"
                                value={data.harga_jual}
                                onChange={(event) =>
                                    setData('harga_jual', event.target.value)
                                }
                                placeholder="65000"
                                className={`${inputClass} ${errorClass('harga_jual')}`}
                            />
                        </Field>

                        <Field label="Diskon (%)" error={errors.diskon}>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={data.diskon}
                                onChange={(event) =>
                                    setData('diskon', event.target.value)
                                }
                                placeholder="0"
                                className={`${inputClass} ${errorClass('diskon')}`}
                            />
                        </Field>
                    </div>

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
                            {editing ? 'Simpan Perubahan' : 'Simpan Produk'}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                title="Hapus Produk"
                maxWidth="max-w-md"
            >
                <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                        <Icon name="alert" className="h-6 w-6" />
                    </span>
                    <p className="text-sm text-slate-600">
                        Yakin ingin menghapus produk{' '}
                        <span className="font-semibold text-slate-800">
                            {deleteTarget?.nama_produk}
                        </span>{' '}
                        ({deleteTarget?.kode_produk})? Tindakan ini tidak dapat
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

ProdukIndex.layout = (page) => (
    <AdminLayout title="Produk & Stok">{page}</AdminLayout>
);
