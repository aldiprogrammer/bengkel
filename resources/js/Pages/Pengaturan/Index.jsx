import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import PageHeader from '../../Components/PageHeader';
import Icon from '../../Components/Icons';

const tabs = ['Profil Bengkel', 'Preferensi', 'Notifikasi'];

function Field({ label, children, hint }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {label}
            </span>
            {children}
            {hint && (
                <span className="mt-1 block text-xs text-slate-400">
                    {hint}
                </span>
            )}
        </label>
    );
}

const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20';

export default function PengaturanIndex() {
    const [activeTab, setActiveTab] = useState(tabs[0]);

    return (
        <>
            <Head title="Pengaturan" />

            <PageHeader
                title="Pengaturan"
                description="Atur profil bengkel dan preferensi aplikasi."
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm lg:flex-col lg:overflow-visible">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-left text-sm font-medium transition ${
                                activeTab === tab
                                    ? 'bg-brand-50 text-brand-700'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="lg:col-span-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        {activeTab === 'Profil Bengkel' && (
                            <div className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-white">
                                        <Icon
                                            name="wrench"
                                            className="h-8 w-8"
                                        />
                                    </span>
                                    <div>
                                        <p className="font-semibold text-slate-800">
                                            Logo Bengkel
                                        </p>
                                        <button
                                            type="button"
                                            className="mt-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                                        >
                                            Ganti logo
                                        </button>
                                    </div>
                                </div>

                                <Field label="Nama Bengkel">
                                    <input
                                        type="text"
                                        defaultValue="Bengkel Jaya Motor"
                                        className={inputClass}
                                    />
                                </Field>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <Field label="Telepon">
                                        <input
                                            type="text"
                                            defaultValue="021-555-1234"
                                            className={inputClass}
                                        />
                                    </Field>
                                    <Field label="Email">
                                        <input
                                            type="email"
                                            defaultValue="info@posbengkel.test"
                                            className={inputClass}
                                        />
                                    </Field>
                                </div>

                                <Field label="Alamat">
                                    <textarea
                                        rows={3}
                                        defaultValue="Jl. Raya Mekanik No. 45, Jakarta Selatan"
                                        className={inputClass}
                                    />
                                </Field>
                            </div>
                        )}

                        {activeTab === 'Preferensi' && (
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <Field label="Mata Uang">
                                        <select className={inputClass}>
                                            <option>IDR - Rupiah</option>
                                            <option>USD - Dolar Amerika</option>
                                        </select>
                                    </Field>
                                    <Field label="Zona Waktu">
                                        <select className={inputClass}>
                                            <option>Asia/Jakarta (WIB)</option>
                                            <option>Asia/Makassar (WITA)</option>
                                            <option>Asia/Jayapura (WIT)</option>
                                        </select>
                                    </Field>
                                </div>
                                <Field
                                    label="PPN (%)"
                                    hint="Persentase pajak yang diterapkan pada transaksi."
                                >
                                    <input
                                        type="number"
                                        defaultValue={11}
                                        className={inputClass}
                                    />
                                </Field>
                                <Field
                                    label="Format Nomor Work Order"
                                    hint="Gunakan {nomor} sebagai penanda urutan."
                                >
                                    <input
                                        type="text"
                                        defaultValue="WO-{nomor}"
                                        className={inputClass}
                                    />
                                </Field>
                            </div>
                        )}

                        {activeTab === 'Notifikasi' && (
                            <div className="space-y-4">
                                {[
                                    {
                                        title: 'Notifikasi stok menipis',
                                        description:
                                            'Kirim peringatan saat stok produk di bawah batas minimum.',
                                    },
                                    {
                                        title: 'Notifikasi work order baru',
                                        description:
                                            'Kirim notifikasi saat ada order servis masuk.',
                                    },
                                    {
                                        title: 'Ringkasan harian',
                                        description:
                                            'Terima ringkasan pendapatan setiap akhir hari.',
                                    },
                                ].map((item, index) => (
                                    <label
                                        key={item.title}
                                        className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50/60 p-4"
                                    >
                                        <span>
                                            <span className="block text-sm font-medium text-slate-800">
                                                {item.title}
                                            </span>
                                            <span className="block text-xs text-slate-500">
                                                {item.description}
                                            </span>
                                        </span>
                                        <input
                                            type="checkbox"
                                            defaultChecked={index !== 2}
                                            className="mt-0.5 h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                        />
                                    </label>
                                ))}
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-5">
                            <button
                                type="button"
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

PengaturanIndex.layout = (page) => (
    <AdminLayout title="Pengaturan">{page}</AdminLayout>
);
