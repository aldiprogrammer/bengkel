import Icon from '../Components/Icons';

const features = [
    {
        icon: 'wrench',
        title: 'Work Order Rapi',
        description: 'Kelola antrean servis dan progres pengerjaan dengan mudah.',
    },
    {
        icon: 'cart',
        title: 'Kasir Terintegrasi',
        description: 'Proses transaksi penjualan sparepart dan jasa secara cepat.',
    },
    {
        icon: 'chart',
        title: 'Laporan Real-time',
        description: 'Pantau pendapatan dan performa bengkel setiap saat.',
    },
];

export default function AuthLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-slate-100">
            <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 p-12 lg:flex">
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
                <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-brand-400/10 blur-3xl" />

                <div className="relative flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/20">
                        <Icon name="wrench" className="h-6 w-6" />
                    </span>
                    <div className="leading-tight">
                        <p className="text-lg font-bold text-white">
                            POS Bengkel
                        </p>
                        <p className="text-xs font-medium text-brand-200">
                            Sistem Manajemen Bengkel
                        </p>
                    </div>
                </div>

                <div className="relative">
                    <h1 className="text-3xl font-bold leading-tight text-white">
                        Kelola bengkel Anda
                        <br />
                        lebih cepat dan rapi.
                    </h1>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-100">
                        Satu aplikasi untuk pelanggan, kendaraan, work order,
                        stok sparepart, hingga kasir.
                    </p>

                    <div className="mt-10 space-y-5">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="flex items-start gap-4"
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-100 ring-1 ring-white/10">
                                    <Icon
                                        name={feature.icon}
                                        className="h-5 w-5"
                                    />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        {feature.title}
                                    </p>
                                    <p className="text-xs text-brand-200">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative text-xs text-brand-300">
                    &copy; {new Date().getFullYear()} POS Bengkel. Seluruh hak
                    cipta dilindungi.
                </p>
            </div>

            <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
}
