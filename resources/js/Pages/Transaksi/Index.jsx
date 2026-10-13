import { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import PageHeader from '../../Components/PageHeader';
import Icon from '../../Components/Icons';

const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

const products = [
    { id: 1, name: 'Oli Mesin 10W-40', sku: 'OLI-001', price: 65000, category: 'Pelumas' },
    { id: 2, name: 'Filter Oli Universal', sku: 'FLT-012', price: 45000, category: 'Filter' },
    { id: 3, name: 'Kampas Rem Depan', sku: 'BRM-034', price: 120000, category: 'Kaki-kaki' },
    { id: 4, name: 'Busi Iridium', sku: 'BUS-009', price: 85000, category: 'Kelistrikan' },
    { id: 5, name: 'Aki Kering 12V', sku: 'AKI-021', price: 780000, category: 'Kelistrikan' },
    { id: 6, name: 'Lampu LED Headlamp', sku: 'LMP-005', price: 95000, category: 'Aksesoris' },
];

export default function TransaksiIndex() {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart((current) => {
            const existing = current.find((item) => item.id === product.id);

            if (existing) {
                return current.map((item) =>
                    item.id === product.id
                        ? { ...item, qty: item.qty + 1 }
                        : item,
                );
            }

            return [...current, { ...product, qty: 1 }];
        });
    };

    const updateQty = (id, delta) => {
        setCart((current) =>
            current
                .map((item) =>
                    item.id === id
                        ? { ...item, qty: item.qty + delta }
                        : item,
                )
                .filter((item) => item.qty > 0),
        );
    };

    const removeItem = (id) => {
        setCart((current) => current.filter((item) => item.id !== id));
    };

    const subtotal = useMemo(
        () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
        [cart],
    );
    const tax = Math.round(subtotal * 0.11);
    const total = subtotal + tax;

    return (
        <>
            <Head title="Transaksi POS" />

            <PageHeader
                title="Transaksi POS"
                description="Kasir penjualan sparepart dan jasa servis."
            />

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <div className="mb-4 relative">
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                            <Icon name="search" className="h-4 w-4" />
                        </span>
                        <input
                            type="search"
                            placeholder="Cari produk atau scan barcode..."
                            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {products.map((product) => (
                            <button
                                key={product.id}
                                type="button"
                                onClick={() => addToCart(product)}
                                className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-brand-300 hover:shadow-md"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                                    <Icon name="box" className="h-5 w-5" />
                                </span>
                                <span className="mt-3 text-sm font-medium text-slate-800">
                                    {product.name}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {product.sku}
                                </span>
                                <span className="mt-2 font-semibold text-brand-700">
                                    {currency.format(product.price)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex h-fit flex-col rounded-xl border border-slate-200 bg-white shadow-sm xl:sticky xl:top-20">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <h3 className="font-semibold text-slate-900">
                            Keranjang
                        </h3>
                        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                            {cart.reduce((sum, item) => sum + item.qty, 0)} item
                        </span>
                    </div>

                    <div className="max-h-80 flex-1 overflow-y-auto px-5 py-4">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                    <Icon name="cart" className="h-6 w-6" />
                                </span>
                                <p className="mt-3 text-sm text-slate-400">
                                    Keranjang masih kosong.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-slate-800">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {currency.format(item.price)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateQty(item.id, -1)
                                                }
                                                className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                                            >
                                                −
                                            </button>
                                            <span className="w-6 text-center text-sm font-semibold text-slate-800">
                                                {item.qty}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateQty(item.id, 1)
                                                }
                                                className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.id)}
                                            className="text-slate-300 hover:text-rose-500"
                                            aria-label="Hapus item"
                                        >
                                            <Icon
                                                name="close"
                                                className="h-4 w-4"
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 border-t border-slate-100 px-5 py-4 text-sm">
                        <div className="flex justify-between text-slate-500">
                            <span>Subtotal</span>
                            <span>{currency.format(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>PPN 11%</span>
                            <span>{currency.format(tax)}</span>
                        </div>
                        <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 text-base font-bold text-slate-900">
                            <span>Total</span>
                            <span>{currency.format(total)}</span>
                        </div>

                        <button
                            type="button"
                            disabled={cart.length === 0}
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Icon name="wallet" className="h-4 w-4" />
                            Bayar Sekarang
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

TransaksiIndex.layout = (page) => (
    <AdminLayout title="Transaksi POS">{page}</AdminLayout>
);
