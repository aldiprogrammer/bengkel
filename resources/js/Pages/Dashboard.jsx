import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import Icon from '../Components/Icons';
import StatusBadge from '../Components/StatusBadge';

const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat('id-ID');

function formatValue(stat) {
    return stat.format === 'currency'
        ? currency.format(stat.value)
        : number.format(stat.value);
}

const orderTones = {
    Selesai: 'green',
    Dikerjakan: 'blue',
    Menunggu: 'amber',
};

function StatCard({ stat }) {
    const isUp = stat.trend === 'up';

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon name={stat.icon} className="h-6 w-6" />
                </span>
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                        isUp
                            ? 'bg-brand-50 text-brand-700 ring-brand-200'
                            : 'bg-rose-50 text-rose-700 ring-rose-200'
                    }`}
                >
                    <Icon
                        name={isUp ? 'arrowUp' : 'arrowDown'}
                        className="h-3.5 w-3.5"
                    />
                    {stat.change}%
                </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-900">
                {formatValue(stat)}
            </p>
            <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
        </div>
    );
}

function SalesChart({ data }) {
    const max = Math.max(...data.map((item) => item.value), 1);

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-slate-900">
                        Pendapatan Bulanan
                    </h3>
                    <p className="text-xs text-slate-500">
                        Total pendapatan bengkel (dalam juta rupiah)
                    </p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon name="wallet" className="h-5 w-5" />
                </span>
            </div>

            <div className="mt-6 flex h-52 items-end gap-2">
                {data.map((item) => (
                    <div
                        key={item.month}
                        className="group flex flex-1 flex-col items-center gap-2"
                    >
                        <span className="text-[10px] font-semibold text-slate-400 opacity-0 transition group-hover:opacity-100">
                            {item.value}jt
                        </span>
                        <div className="flex w-full flex-1 items-end">
                            <div
                                className="w-full rounded-t-md bg-gradient-to-t from-brand-500 to-brand-400 transition-all group-hover:from-brand-600 group-hover:to-brand-500"
                                style={{
                                    height: `${Math.round(
                                        (item.value / max) * 100,
                                    )}%`,
                                }}
                            />
                        </div>
                        <span className="text-[10px] font-medium text-slate-500">
                            {item.month}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ServiceBreakdown({ data }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">
                Jenis Servis Terbanyak
            </h3>
            <p className="text-xs text-slate-500">
                Distribusi order berdasarkan jenis pengerjaan
            </p>

            <div className="mt-6 space-y-4">
                {data.map((item) => (
                    <div key={item.label}>
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-600">
                                {item.label}
                            </span>
                            <span className="font-semibold text-slate-900">
                                {Math.round((item.value / total) * 100)}%
                            </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${(item.value / total) * 100}%`,
                                    backgroundColor: item.color,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RecentOrders({ orders }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                    <h3 className="font-semibold text-slate-900">
                        Work Order Terbaru
                    </h3>
                    <p className="text-xs text-slate-500">
                        Daftar servis yang terakhir masuk
                    </p>
                </div>
                <Link
                    href="/servis"
                    className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                    Lihat semua
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                No. Order
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Pelanggan
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Status
                            </th>
                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="hover:bg-slate-50"
                            >
                                <td className="whitespace-nowrap px-5 py-3">
                                    <span className="font-semibold text-slate-800">
                                        {order.id}
                                    </span>
                                    <span className="block text-xs text-slate-400">
                                        {order.date}
                                    </span>
                                </td>
                                <td className="px-5 py-3">
                                    <span className="font-medium text-slate-700">
                                        {order.customer}
                                    </span>
                                    <span className="block text-xs text-slate-400">
                                        {order.vehicle}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-5 py-3">
                                    <StatusBadge
                                        tone={orderTones[order.status]}
                                    >
                                        {order.status}
                                    </StatusBadge>
                                </td>
                                <td className="whitespace-nowrap px-5 py-3 text-right font-semibold text-slate-800">
                                    {currency.format(order.amount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function Dashboard({
    stats = [],
    salesChart = [],
    serviceBreakdown = [],
    recentOrders = [],
}) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard key={stat.label} stat={stat} />
                ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <SalesChart data={salesChart} />
                </div>
                <ServiceBreakdown data={serviceBreakdown} />
            </div>

            <div className="mt-6">
                <RecentOrders orders={recentOrders} />
            </div>
        </>
    );
}

Dashboard.layout = (page) => (
    <AdminLayout title="Dashboard">{page}</AdminLayout>
);
