import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import PageHeader from '../../Components/PageHeader';
import DataTable from '../../Components/DataTable';
import Icon from '../../Components/Icons';

const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

const summary = [
    { label: 'Pendapatan Tahun Ini', value: 512300000, format: 'currency', icon: 'wallet' },
    { label: 'Total Work Order', value: 1284, format: 'number', icon: 'wrench' },
    { label: 'Rata-rata per Order', value: 399000, format: 'currency', icon: 'chart' },
];

const report = [
    { id: 1, month: 'Oktober 2026', orders: 138, revenue: 48250000, growth: 12.5 },
    { id: 2, month: 'September 2026', orders: 121, revenue: 42870000, growth: 6.8 },
    { id: 3, month: 'Agustus 2026', orders: 132, revenue: 40150000, growth: -2.3 },
    { id: 4, month: 'Juli 2026', orders: 118, revenue: 41100000, growth: 4.1 },
    { id: 5, month: 'Juni 2026', orders: 109, revenue: 39480000, growth: 1.9 },
];

const columns = [
    {
        key: 'month',
        label: 'Periode',
        render: (row) => (
            <span className="font-medium text-slate-800">{row.month}</span>
        ),
    },
    {
        key: 'orders',
        label: 'Jumlah Order',
        render: (row) => `${row.orders} order`,
    },
    {
        key: 'revenue',
        label: 'Pendapatan',
        render: (row) => currency.format(row.revenue),
    },
    {
        key: 'growth',
        label: 'Pertumbuhan',
        render: (row) => (
            <span
                className={`inline-flex items-center gap-1 font-semibold ${
                    row.growth >= 0 ? 'text-brand-600' : 'text-rose-600'
                }`}
            >
                <Icon
                    name={row.growth >= 0 ? 'arrowUp' : 'arrowDown'}
                    className="h-3.5 w-3.5"
                />
                {Math.abs(row.growth)}%
            </span>
        ),
    },
];

export default function LaporanIndex() {
    return (
        <>
            <Head title="Laporan" />

            <PageHeader
                title="Laporan"
                description="Ringkasan performa penjualan dan servis bengkel."
            >
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                    <Icon name="filter" className="h-4 w-4" />
                    Periode
                </button>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700"
                >
                    <Icon name="download" className="h-4 w-4" />
                    Unduh Laporan
                </button>
            </PageHeader>

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
                                    : new Intl.NumberFormat('id-ID').format(
                                          item.value,
                                      )}
                            </p>
                            <p className="text-sm text-slate-500">
                                {item.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <DataTable columns={columns} rows={report} />
        </>
    );
}

LaporanIndex.layout = (page) => (
    <AdminLayout title="Laporan">{page}</AdminLayout>
);
