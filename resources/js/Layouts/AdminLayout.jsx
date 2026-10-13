import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import Icon from '../Components/Icons';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { name: 'Pelanggan', href: '/pelanggan', icon: 'users' },
    { name: 'Pegawai', href: '/pegawai', icon: 'badge' },
    { name: 'Pengguna', href: '/pengguna', icon: 'shield' },
    { name: 'Kendaraan', href: '/kendaraan', icon: 'truck' },
    { name: 'Servis / Work Order', href: '/servis', icon: 'wrench' },
    { name: 'Kategori', href: '/kategori', icon: 'folder' },
    { name: 'Produk & Stok', href: '/produk', icon: 'box' },
    { name: 'Jasa', href: '/jasa', icon: 'tag' },
    { name: 'Transaksi POS', href: '/transaksi', icon: 'cart' },
    { name: 'Laporan', href: '/laporan', icon: 'chart' },
    { name: 'Pengaturan', href: '/pengaturan', icon: 'settings' },
];

function isActive(currentUrl, href) {
    const path = currentUrl.split('?')[0];

    return path === href || path.startsWith(`${href}/`);
}

function Brand() {
    return (
        <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-900/30">
                <Icon name="wrench" className="h-6 w-6" />
            </span>
            <span className="flex flex-col leading-tight">
                <span className="text-base font-bold tracking-tight text-white">
                    POS Bengkel
                </span>
                <span className="text-[11px] font-medium text-brand-300">
                    Sistem Manajemen Bengkel
                </span>
            </span>
        </div>
    );
}

function SidebarContent({ currentUrl, onNavigate }) {
    return (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center px-5">
                <Link href="/dashboard" onClick={onNavigate}>
                    <Brand />
                </Link>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-brand-400">
                    Menu Utama
                </p>
                {navigation.map((item) => {
                    const active = isActive(currentUrl, item.href);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onNavigate}
                            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                active
                                    ? 'bg-brand-500 text-white shadow-sm shadow-brand-900/30'
                                    : 'text-brand-100 hover:bg-brand-700/60 hover:text-white'
                            }`}
                        >
                            <Icon
                                name={item.icon}
                                className={`h-5 w-5 shrink-0 ${
                                    active
                                        ? 'text-white'
                                        : 'text-brand-300 group-hover:text-white'
                                }`}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-brand-700/60 p-4">
                <div className="rounded-xl bg-brand-700/50 p-4">
                    <p className="text-sm font-semibold text-white">
                        Butuh bantuan?
                    </p>
                    <p className="mt-1 text-xs text-brand-200">
                        Lihat panduan penggunaan POS Bengkel.
                    </p>
                    <button
                        type="button"
                        className="mt-3 w-full rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                    >
                        Buka Panduan
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminLayout({ title, children }) {
    const { props, url } = usePage();
    const user = props.auth?.user;
    const flash = props.flash ?? {};

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const initials = (user?.name ?? 'A')
        .split(' ')
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const logout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="fixed inset-0 bg-slate-900/60"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-brand-800 to-brand-950">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                            className="absolute right-3 top-5 rounded-lg p-1 text-brand-200 hover:bg-brand-700 hover:text-white"
                            aria-label="Tutup menu"
                        >
                            <Icon name="close" className="h-5 w-5" />
                        </button>
                        <SidebarContent
                            currentUrl={url}
                            onNavigate={() => setSidebarOpen(false)}
                        />
                    </aside>
                </div>
            )}

            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-gradient-to-b from-brand-800 to-brand-950 lg:block">
                <SidebarContent currentUrl={url} />
            </aside>

            <div className="flex min-h-screen flex-col lg:pl-64">
                {/* Topbar */}
                <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                        aria-label="Buka menu"
                    >
                        <Icon name="menu" className="h-6 w-6" />
                    </button>

                    <div className="min-w-0">
                        <h1 className="truncate text-lg font-semibold text-slate-900">
                            {title}
                        </h1>
                    </div>

                    <div className="ml-auto flex items-center gap-2 sm:gap-3">
                        <div className="relative hidden md:block">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                                <Icon name="search" className="h-4 w-4" />
                            </span>
                            <input
                                type="search"
                                placeholder="Cari..."
                                className="w-56 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                            />
                        </div>

                        <button
                            type="button"
                            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                            aria-label="Notifikasi"
                        >
                            <Icon name="bell" className="h-5 w-5" />
                            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
                        </button>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setUserMenuOpen((open) => !open)}
                                className="flex items-center gap-2 rounded-lg p-1 pl-2 hover:bg-slate-100"
                            >
                                <span className="hidden text-right sm:block">
                                    <span className="block text-sm font-semibold text-slate-800">
                                        {user?.name ?? 'Administrator'}
                                    </span>
                                    <span className="block text-xs text-slate-500">
                                        Administrator
                                    </span>
                                </span>
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                                    {initials}
                                </span>
                                <Icon
                                    name="chevronDown"
                                    className="h-4 w-4 text-slate-400"
                                />
                            </button>

                            {userMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setUserMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                                        <div className="border-b border-slate-100 px-4 py-3">
                                            <p className="text-sm font-semibold text-slate-800">
                                                {user?.name ?? 'Administrator'}
                                            </p>
                                            <p className="truncate text-xs text-slate-500">
                                                {user?.email ??
                                                    'admin@posbengkel.test'}
                                            </p>
                                        </div>
                                        <Link
                                            href="/pengaturan"
                                            onClick={() =>
                                                setUserMenuOpen(false)
                                            }
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                        >
                                            <Icon
                                                name="settings"
                                                className="h-4 w-4 text-slate-400"
                                            />
                                            Pengaturan
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={logout}
                                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                                        >
                                            <Icon
                                                name="logout"
                                                className="h-4 w-4"
                                            />
                                            Keluar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Flash message */}
                {flash.success && (
                    <div className="px-4 pt-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800">
                            <Icon
                                name="check"
                                className="h-5 w-5 shrink-0 text-brand-600"
                            />
                            {flash.success}
                        </div>
                    </div>
                )}

                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </main>

                <footer className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
                    &copy; {new Date().getFullYear()} POS Bengkel. Seluruh hak
                    cipta dilindungi.
                </footer>
            </div>
        </div>
    );
}
