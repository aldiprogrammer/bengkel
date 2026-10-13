import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import Icon from '../../Components/Icons';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (event) => {
        event.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk" />

            <div className="flex items-center gap-3 lg:hidden">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
                    <Icon name="wrench" className="h-5 w-5" />
                </span>
                <span className="text-lg font-bold text-slate-900">
                    POS Bengkel
                </span>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60 lg:mt-0">
                <h1 className="text-2xl font-bold text-slate-900">
                    Selamat datang kembali
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Masuk untuk mengelola bengkel Anda.
                </p>

                <form onSubmit={submit} className="mt-8 space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                                <Icon name="mail" className="h-5 w-5" />
                            </span>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                autoComplete="username"
                                autoFocus
                                onChange={(event) =>
                                    setData('email', event.target.value)
                                }
                                placeholder="admin@posbengkel.test"
                                className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                                    errors.email
                                        ? 'border-rose-400 focus:border-rose-500'
                                        : 'border-slate-200 focus:border-brand-500'
                                }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1.5 text-xs font-medium text-rose-600">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                            Kata Sandi
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                                <Icon name="lock" className="h-5 w-5" />
                            </span>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                autoComplete="current-password"
                                onChange={(event) =>
                                    setData('password', event.target.value)
                                }
                                placeholder="••••••••"
                                className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-11 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                                    errors.password
                                        ? 'border-rose-400 focus:border-rose-500'
                                        : 'border-slate-200 focus:border-brand-500'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((visible) => !visible)
                                }
                                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                                aria-label="Tampilkan kata sandi"
                            >
                                <Icon
                                    name={showPassword ? 'eyeSlash' : 'eye'}
                                    className="h-5 w-5"
                                />
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1.5 text-xs font-medium text-rose-600">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(event) =>
                                    setData('remember', event.target.checked)
                                }
                                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                            />
                            Ingat saya
                        </label>
                        <a
                            href="#"
                            className="text-sm font-medium text-brand-600 hover:text-brand-700"
                        >
                            Lupa kata sandi?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? 'Memproses...' : 'Masuk'}
                        <Icon name="logout" className="h-4 w-4" />
                    </button>
                </form>

                <div className="mt-6 rounded-lg bg-slate-50 px-4 py-3 text-xs text-slate-500">
                    <p className="font-semibold text-slate-600">
                        Akun demo
                    </p>
                    <p className="mt-0.5">
                        Email: admin@posbengkel.test &middot; Kata sandi:
                        password
                    </p>
                </div>
            </div>
        </>
    );
}

Login.layout = (page) => <AuthLayout>{page}</AuthLayout>;
