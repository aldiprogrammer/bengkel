import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import PageHeader from '../../Components/PageHeader';
import DataTable from '../../Components/DataTable';
import StatusBadge from '../../Components/StatusBadge';
import Icon from '../../Components/Icons';

const orders = [
    {
        id: 'WO-2041',
        customer: 'Budi Santoso',
        vehicle: 'Toyota Avanza - B 1023 XYZ',
        service: 'Servis rutin + ganti oli',
        mechanic: 'Joko',
        status: 'Selesai',
        date: '12 Okt 2026',
    },
    {
        id: 'WO-2040',
        customer: 'Siti Aminah',
        vehicle: 'Honda Beat - B 4521 QW',
        service: 'Ganti kampas rem',
        mechanic: 'Hendra',
        status: 'Dikerjakan',
        date: '12 Okt 2026',
    },
    {
        id: 'WO-2039',
        customer: 'Andi Wijaya',
        vehicle: 'Mitsubishi L300 - B 9987 TT',
        service: 'Perbaikan mesin',
        mechanic: 'Joko',
        status: 'Menunggu',
        date: '11 Okt 2026',
    },
    {
        id: 'WO-2038',
        customer: 'Dewi Lestari',
        vehicle: 'Daihatsu Xenia - B 7788 KL',
        service: 'Tune up',
        mechanic: 'Bagus',
        status: 'Selesai',
        date: '11 Okt 2026',
    },
];

const orderTones = {
    Selesai: 'green',
    Dikerjakan: 'blue',
    Menunggu: 'amber',
};

const summary = [
    { label: 'Menunggu', value: 6, icon: 'clock', tone: 'text-amber-600 bg-amber-50' },
    { label: 'Dikerjakan', value: 11, icon: 'wrench', tone: 'text-blue-600 bg-blue-50' },
    { label: 'Selesai Hari Ini', value: 21, icon: 'check', tone: 'text-brand-600 bg-brand-50' },
];

const columns = [
    {
        key: 'id',
        label: 'No. Order',
        render: (row) => (
            <span className="font-semibold text-slate-800">{row.id}</span>
        ),
    },
    {
        key: 'customer',
        label: 'Pelanggan & Kendaraan',
        render: (row) => (
            <div>
                <span className="block font-medium text-slate-700">
                    {row.customer}
                </span>
                <span className="block text-xs text-slate-400">
                    {row.vehicle}
                </span>
            </div>
        ),
    },
    { key: 'service', label: 'Pekerjaan' },
    { key: 'mechanic', label: 'Mekanik' },
    {
        key: 'status',
        label: 'Status',
        render: (row) => (
            <StatusBadge tone={orderTones[row.status]}>
                {row.status}
            </StatusBadge>
        ),
    },
    { key: 'date', label: 'Tanggal' },
];

export default function ServisIndex() {
    return (
        <>
            <Head title="Servis / Work Order" />

            <PageHeader
                title="Servis / Work Order"
                description="Kelola antrean dan progres pengerjaan servis."
            >
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700"
                >
                    <Icon name="plus" className="h-4 w-4" />
                    Buat Work Order
                </button>
            </PageHeader>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {summary.map((item) => (
                    <div
                        key={item.label}
                        className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                        <span
                            className={`flex h-11 w-11 items-center justify-center rounded-lg ${item.tone}`}
                        >
                            <Icon name={item.icon} className="h-6 w-6" />
                        </span>
                        <div>
                            <p className="text-xl font-bold text-slate-900">
                                {item.value}
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

ServisIndex.layout = (page) => (
    <AdminLayout title="Servis / Work Order">{page}</AdminLayout>
);
