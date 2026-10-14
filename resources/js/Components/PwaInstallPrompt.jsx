import { useEffect, useState } from 'react';
import Icon from './Icons';
import { usePwaInstall } from './PwaInstallProvider';

const AUTO_SHOW_DELAY = 2200;

function BoltIcon({ className = 'h-4 w-4' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function DeviceIcon({ className = 'h-4 w-4' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="M10.5 18.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
            <path
                fillRule="evenodd"
                d="M8.625.75A3.375 3.375 0 0 0 5.25 4.125v15.75a3.375 3.375 0 0 0 3.375 3.375h6.75a3.375 3.375 0 0 0 3.375-3.375V4.125A3.375 3.375 0 0 0 15.375.75h-6.75ZM7.5 4.125c0-.621.504-1.125 1.125-1.125h6.75c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 0 1 7.5 19.875V4.125Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function ShieldIcon({ className = 'h-4 w-4' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function IosShareIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M12 3v12" />
            <path d="m8 7 4-4 4 4" />
            <path d="M6.5 11H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1.5" />
        </svg>
    );
}

function AddToHomeIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <path d="M17.5 14v7M14 17.5h7" />
        </svg>
    );
}

const features = [
    { icon: BoltIcon, label: 'Akses cepat' },
    { icon: DeviceIcon, label: 'Layar utama' },
    { icon: ShieldIcon, label: 'Aman & privat' },
];

function FeatureChips() {
    return (
        <ul className="mt-3 flex flex-wrap gap-1.5">
            {features.map(({ icon: FeatureIcon, label }) => (
                <li
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700 ring-1 ring-brand-100"
                >
                    <FeatureIcon className="h-3.5 w-3.5" />
                    {label}
                </li>
            ))}
        </ul>
    );
}

function InstallBanner({ onInstall, onClose }) {
    const [busy, setBusy] = useState(false);

    const handleInstall = async () => {
        setBusy(true);
        await onInstall();
        setBusy(false);
    };

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-6">
            <div className="animate-pwa-in pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-900/25 ring-1 ring-slate-900/5 backdrop-blur-xl">
                <div className="flex items-start gap-4 p-4">
                    <span className="relative shrink-0">
                        <img
                            src="/icons/icon-192.png"
                            alt="POS Bengkel"
                            width="48"
                            height="48"
                            className="h-12 w-12 rounded-2xl shadow-lg shadow-brand-900/25"
                        />
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white ring-2 ring-white">
                            <Icon name="download" className="h-3 w-3" />
                        </span>
                    </span>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                            Pasang POS Bengkel
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                            Akses lebih cepat langsung dari layar utama, tanpa
                            perlu membuka browser.
                        </p>
                        <FeatureChips />
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Tutup"
                    >
                        <Icon name="close" className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/70 px-4 py-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200/60"
                    >
                        Nanti
                    </button>
                    <button
                        type="button"
                        onClick={handleInstall}
                        disabled={busy}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/40 transition hover:from-brand-600 hover:to-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <Icon name="download" className="h-4 w-4" />
                        {busy ? 'Memasang...' : 'Pasang Sekarang'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function IosInstructions({ onClose }) {
    const steps = [
        {
            icon: IosShareIcon,
            title: 'Buka menu Bagikan',
            description: 'Ketuk ikon Bagikan pada bilah bawah Safari.',
        },
        {
            icon: AddToHomeIcon,
            title: 'Pilih "Tambah ke Layar Utama"',
            description: 'Gulir daftar tindakan lalu pilih opsi tersebut.',
        },
        {
            icon: ({ className }) => <Icon name="check" className={className} />,
            title: 'Ketuk "Tambah"',
            description: 'Ikon POS Bengkel akan muncul di layar utama Anda.',
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <div
                className="animate-pwa-fade absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="animate-pwa-in relative w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-7">
                <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden" />

                <div className="flex items-start gap-4">
                    <img
                        src="/icons/icon-192.png"
                        alt="POS Bengkel"
                        width="52"
                        height="52"
                        className="h-13 w-13 shrink-0 rounded-2xl shadow-lg shadow-brand-900/25"
                    />
                    <div className="min-w-0 flex-1">
                        <h2 className="text-base font-bold text-slate-900">
                            Pasang di iPhone / iPad
                        </h2>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                            Tambahkan POS Bengkel ke layar utama lewat Safari
                            dalam 3 langkah.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Tutup"
                    >
                        <Icon name="close" className="h-5 w-5" />
                    </button>
                </div>

                <ol className="mt-6 space-y-3">
                    {steps.map(({ icon: StepIcon, title, description }, index) => (
                        <li
                            key={title}
                            className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5"
                        >
                            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm ring-1 ring-slate-200">
                                <StepIcon className="h-5 w-5" />
                                <span className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white ring-2 ring-white">
                                    {index + 1}
                                </span>
                            </span>
                            <div className="min-w-0 flex-1 pt-0.5">
                                <p className="text-sm font-semibold text-slate-800">
                                    {title}
                                </p>
                                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                                    {description}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-600/40 transition hover:from-brand-600 hover:to-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                >
                    Mengerti
                </button>
            </div>
        </div>
    );
}

export default function PwaInstallPrompt() {
    const {
        canInstall,
        installed,
        isIos,
        recentlyDismissed,
        promptInstall,
        dismiss,
        manualOpen,
        closeManual,
    } = usePwaInstall();

    const [autoVisible, setAutoVisible] = useState(false);

    useEffect(() => {
        const eligible =
            !installed && !recentlyDismissed && (canInstall || isIos);

        if (!eligible) {
            setAutoVisible(false);
            return;
        }

        const timer = setTimeout(() => setAutoVisible(true), AUTO_SHOW_DELAY);

        return () => clearTimeout(timer);
    }, [canInstall, isIos, installed, recentlyDismissed]);

    if (installed) {
        return null;
    }

    const close = () => {
        setAutoVisible(false);
        closeManual();
        dismiss();
    };

    if (isIos) {
        if (!(autoVisible || manualOpen)) {
            return null;
        }

        return <IosInstructions onClose={close} />;
    }

    if (!canInstall || !(autoVisible || manualOpen)) {
        return null;
    }

    return <InstallBanner onInstall={promptInstall} onClose={close} />;
}
