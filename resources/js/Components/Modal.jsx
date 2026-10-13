import { useEffect } from 'react';
import Icon from './Icons';

export default function Modal({
    open,
    onClose,
    title,
    description,
    children,
    maxWidth = 'max-w-lg',
}) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
            <div
                className="fixed inset-0 bg-slate-900/60"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                role="dialog"
                aria-modal="true"
                className={`relative z-10 my-8 w-full ${maxWidth} rounded-2xl bg-white shadow-2xl`}
            >
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">
                            {title}
                        </h3>
                        {description && (
                            <p className="mt-0.5 text-sm text-slate-500">
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Tutup"
                    >
                        <Icon name="close" className="h-5 w-5" />
                    </button>
                </div>

                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
}
