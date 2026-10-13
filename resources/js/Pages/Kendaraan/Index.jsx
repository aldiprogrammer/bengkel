import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import PageHeader from '../../Components/PageHeader';
import DataTable from '../../Components/DataTable';
import StatusBadge from '../../Components/StatusBadge';
import Icon from '../../Components/Icons';

const vehicles = [
    {
        id: 1,
        plate: 'B 1023 XYZ',
        brand: 'Toyota Avanza',
        year: 2019,
        owner: 'Budi Santoso',
        mileage: '72.400 km',
        status: 'Terdaftar',
    },
    {
        id: 2,
        plate: 'B 4521 QW',
        brand: 'Honda Beat',
        year: 2021,
        owner: 'Siti Aminah',
        mileage: '18.900 km',
        status: 'Terdaftar',
    },
    {
        id: 3,
        plate: 'B 9987 TT',
        brand: 'Mitsubishi L300',
        year: 2016,
        owner: 'Andi Wijaya',
        mileage: '143.200 km',
        status: 'Servis',
    },
    {
        id: 4,
        plate: 'B 7788 KL',
        brand: 'Daihatsu Xenia',
        year: 2020,
        owner: 'Dewi Lestari',
        mileage: '45.100 km',
        status: 'Terdaftar',
    },
    {
        id: 5,
        plate: 'B 3344 NM',
        brand: 'Yamaha NMAX',
        year: 2022,
        owner: 'Rizky Pratama',
        mileage: '9.800 km',
        status: 'Servis',
    },
];

const columns = [
    {
        key: 'plate',
        label: 'Nomor Polisi',
        render: (row) => (
            <span className="inline-flex items-center rounded-md border border-slate-900/10 bg-slate-900 px-2 py-1 text-xs font-semibold tracking-wider text-white">
                {row.plate}
            </span>
        ),
    },
    { key: 'brand', label: 'Kendaraan' },
    {
        key: 'year',
        label: 'Tahun',
        render: (row) => row.year,
    },
    { key: 'owner', label: 'Pemilik' },
    { key: 'mileage', label: 'Odometer' },
    {
        key: 'status',
        label: 'Status',
        render: (row) => (
            <StatusBadge
                tone={row.status === 'Servis' ? 'amber' : 'green'}
            >
                {row.status}
            </StatusBadge>
        ),
    },
];

export default function KendaraanIndex() {
    return (
        <>
            <Head title="Kendaraan" />

            <PageHeader
                title="Kendaraan"
                description="Data kendaraan pelanggan yang terdaftar di bengkel."
            >
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700"
                >
                    <Icon name="plus" className="h-4 w-4" />
                    Tambah Kendaraan
                </button>
            </PageHeader>

            <div className="mb-4 relative sm:max-w-xs">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <Icon name="search" className="h-4 w-4" />
                </span>
                <input
                    type="search"
                    placeholder="Cari nomor polisi atau pemilik..."
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
            </div>

            <DataTable columns={columns} rows={vehicles} />
        </>
    );
}

KendaraanIndex.layout = (page) => (
    <AdminLayout title="Kendaraan">{page}</AdminLayout>
);
