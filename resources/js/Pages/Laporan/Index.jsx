import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import PageHeader from '../../Components/PageHeader';
import DataTable from '../../Components/DataTable';
import Icon from '../../Components/Icons';

const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat('id-ID');

const date = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

const inputClass =
    'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20';

const labelClass =
    'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500';

const columns = [
    {
        key: 'kode_order',
        label: 'Kode Order',
        render: (row) => (
            <span className="font-medium text-slate-800">{row.kode_order}</span>
        ),
    },
    {
        key: 'tanggal',
        label: 'Tanggal',
        render: (row) => date.format(new Date(row.tanggal)),
    },
    { key: 'pelanggan', label: 'Pelanggan' },
    { key: 'metode_pembayaran', label: 'Metode' },
    {
        key: 'grand_total',
        label: 'Total',
        className: 'text-right',
        render: (row) => (
            <span className="font-semibold text-slate-800">
                {currency.format(row.grand_total)}
            </span>
        ),
    },
];

export default function LaporanIndex({ orders = [], summary = [], filters = {} }) {
    const [mode, setMode] = useState(filters.mode ?? 'bulan');
    const [bulan, setBulan] = useState(filters.bulan ?? '');
    const [dari, setDari] = useState(filters.dari ?? '');
    const [sampai, setSampai] = useState(filters.sampai ?? '');

    const query =
        mode === 'rentang' ? { mode, dari, sampai } : { mode, bulan };
    const exportUrl = `/laporan/export?${new URLSearchParams(query).toString()}`;

    const apply = (event) => {
        event.preventDefault();

        router.get('/laporan', query, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title="Laporan" />

            <PageHeader
                title="Laporan"
                description="Ringkasan dan daftar transaksi order bengkel."
            >
                <a
                    href={exportUrl}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700"
                >
                    <Icon name="download" className="h-4 w-4" />
                    Unduh PDF
                </a>
            </PageHeader>

            <form
                onSubmit={apply}
                className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex flex-wrap items-end gap-4">
                        <div>
                            <span className={labelClass}>Filter</span>
                            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                                {[
                                    { value: 'bulan', label: 'Bulan' },
                                    {
                                        value: 'rentang',
                                        label: 'Rentang Tanggal',
                                    },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setMode(option.value)}
                                        className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                                            mode === option.value
                                                ? 'bg-white text-brand-700 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {mode === 'bulan' ? (
                            <label className="block">
                                <span className={labelClass}>Bulan</span>
                                <input
                                    type="month"
                                    value={bulan}
                                    onChange={(event) =>
                                        setBulan(event.target.value)
                                    }
                                    className={inputClass}
                                />
                            </label>
                        ) : (
                            <>
                                <label className="block">
                                    <span className={labelClass}>Dari</span>
                                    <input
                                        type="date"
                                        value={dari}
                                        onChange={(event) =>
                                            setDari(event.target.value)
                                        }
                                        className={inputClass}
                                    />
                                </label>
                                <label className="block">
                                    <span className={labelClass}>Sampai</span>
                                    <input
                                        type="date"
                                        value={sampai}
                                        onChange={(event) =>
                                            setSampai(event.target.value)
                                        }
                                        className={inputClass}
                                    />
                                </label>
                            </>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        <Icon name="filter" className="h-4 w-4" />
                        Terapkan
                    </button>
                </div>
            </form>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {summary.map((item) => (
                    <div
                        key={item.label}
                        className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                            <Icon name={item.icon} className="h-6 w-6" />
                        </span>
                        <div>
                            <p className="text-lg font-bold text-slate-900">
                                {item.format === 'currency'
                                    ? currency.format(item.value)
                                    : number.format(item.value)}
                            </p>
                            <p className="text-sm text-slate-500">
                                {item.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <DataTable columns={columns} rows={orders} />
        </>
    );
}

LaporanIndex.layout = (page) => (
    <AdminLayout title="Laporan">{page}</AdminLayout>
);
