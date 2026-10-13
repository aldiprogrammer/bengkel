import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import PageHeader from '../../Components/PageHeader';
import DataTable from '../../Components/DataTable';
import Modal from '../../Components/Modal';
import StatusBadge from '../../Components/StatusBadge';
import Icon from '../../Components/Icons';

const roleOptions = ['Admin', 'Kasir'];

const inputClass =
    'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20';

const formatDate = (value) => {
    if (!value) {
        return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
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

export default function PenggunaIndex({ pengguna = [] }) {
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [search, setSearch] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterRole, setFilterRole] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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
        name: '',
        email: '',
        role: 'Kasir',
        password: '',
    });

    const openCreate = () => {
        clearErrors();
        setEditing(null);
        setShowPassword(false);
        setData({ name: '', email: '', role: 'Kasir', password: '' });
        setFormOpen(true);
    };

    const openEdit = (row) => {
        clearErrors();
        setEditing(row);
        setShowPassword(false);
        setData({
            name: row.name,
            email: row.email,
            role: row.role,
            password: '',
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
            put(`/pengguna/${editing.id}`, options);
        } else {
            post('/pengguna', options);
        }
    };

    const confirmDelete = () => {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/pengguna/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const errorClass = (field) =>
        errors[field]
            ? 'border-rose-400 focus:border-rose-500'
            : 'border-slate-200 focus:border-brand-500';

    const keyword = search.trim().toLowerCase();
    const activeFilterCount = filterRole ? 1 : 0;

    const filteredPengguna = pengguna.filter((row) => {
        const matchesKeyword =
            !keyword ||
            [row.name, row.email, row.role]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(keyword),
                );

        const matchesRole = !filterRole || row.role === filterRole;

        return matchesKeyword && matchesRole;
    });

    const columns = [
        {
            key: 'name',
            label: 'Nama',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                        {row.name.charAt(0)}
                    </span>
                    <span className="font-medium text-slate-800">
                        {row.name}
                    </span>
                </div>
            ),
        },
        {
            key: 'email',
            label: 'Email',
            render: (row) => (
                <span className="whitespace-nowrap text-slate-600">
                    {row.email}
                </span>
            ),
        },
        {
            key: 'role',
            label: 'Role',
            render: (row) => (
                <StatusBadge tone={row.role === 'Admin' ? 'blue' : 'amber'}>
                    {row.role}
                </StatusBadge>
            ),
        },
        {
            key: 'created_at',
            label: 'Dibuat',
            render: (row) => (
                <span className="whitespace-nowrap text-slate-600">
                    {formatDate(row.created_at)}
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
                        aria-label="Edit pengguna"
                    >
                        <Icon name="edit" className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setDeleteTarget(row)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Hapus pengguna"
                    >
                        <Icon name="trash" className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Pengguna" />

            <PageHeader
                title="Pengguna"
                description="Kelola akun pengguna, role, dan kata sandi."
            >
                <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700"
                >
                    <Icon name="plus" className="h-4 w-4" />
                    Tambah Pengguna
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
                        placeholder="Cari nama, email, role..."
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
                                        Role
                                    </span>
                                    <select
                                        value={filterRole}
                                        onChange={(event) =>
                                            setFilterRole(event.target.value)
                                        }
                                        className={`${inputClass} border-slate-200 focus:border-brand-500`}
                                    >
                                        <option value="">Semua Role</option>
                                        {roleOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <div className="mt-4 flex justify-between gap-2 border-t border-slate-100 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setFilterRole('')}
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
                rows={filteredPengguna}
                emptyMessage={
                    keyword || activeFilterCount > 0
                        ? 'Tidak ada pengguna yang cocok dengan pencarian atau filter.'
                        : 'Belum ada data pengguna.'
                }
            />

            <Modal
                open={formOpen}
                onClose={closeForm}
                title={editing ? 'Edit Pengguna' : 'Tambah Pengguna'}
                description={
                    editing
                        ? 'Perbarui data pengguna di bawah ini.'
                        : 'Lengkapi data pengguna baru di bawah ini.'
                }
                maxWidth="max-w-2xl"
            >
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Nama" error={errors.name}>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                                placeholder="Nama pengguna"
                                className={`${inputClass} ${errorClass('name')}`}
                            />
                        </Field>

                        <Field label="Email" error={errors.email}>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(event) =>
                                    setData('email', event.target.value)
                                }
                                placeholder="pengguna@posbengkel.test"
                                className={`${inputClass} ${errorClass('email')}`}
                            />
                        </Field>

                        <Field label="Role" error={errors.role}>
                            <select
                                value={data.role}
                                onChange={(event) =>
                                    setData('role', event.target.value)
                                }
                                className={`${inputClass} ${errorClass('role')}`}
                            >
                                {roleOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field
                            label={
                                editing
                                    ? 'Kata Sandi (opsional)'
                                    : 'Kata Sandi'
                            }
                            error={errors.password}
                        >
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(event) =>
                                        setData('password', event.target.value)
                                    }
                                    placeholder={
                                        editing
                                            ? 'Kosongkan jika tidak diubah'
                                            : 'Minimal 8 karakter'
                                    }
                                    className={`${inputClass} pr-10 ${errorClass('password')}`}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((value) => !value)
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                                    aria-label="Tampilkan kata sandi"
                                >
                                    <Icon
                                        name={showPassword ? 'eyeSlash' : 'eye'}
                                        className="h-4 w-4"
                                    />
                                </button>
                            </div>
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
                            {editing ? 'Simpan Perubahan' : 'Simpan Pengguna'}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                title="Hapus Pengguna"
                maxWidth="max-w-md"
            >
                <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                        <Icon name="alert" className="h-6 w-6" />
                    </span>
                    <p className="text-sm text-slate-600">
                        Yakin ingin menghapus pengguna{' '}
                        <span className="font-semibold text-slate-800">
                            {deleteTarget?.name}
                        </span>{' '}
                        ({deleteTarget?.email})? Tindakan ini tidak dapat
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

PenggunaIndex.layout = (page) => (
    <AdminLayout title="Pengguna">{page}</AdminLayout>
);
