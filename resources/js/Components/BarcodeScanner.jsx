import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Icon from './Icons';
import Modal from './Modal';

const SCANNER_ID = 'barcode-scanner-region';

export default function BarcodeScanner({ open, onClose, onDetected }) {
    const onCloseRef = useRef(onClose);
    const onDetectedRef = useRef(onDetected);
    const [error, setError] = useState('');

    useEffect(() => {
        onCloseRef.current = onClose;
        onDetectedRef.current = onDetected;
    });

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        setError('');

        let scanner;

        try {
            scanner = new Html5Qrcode(SCANNER_ID, {
                useBarCodeDetectorIfSupported: true,
            });
        } catch {
            setError('Scanner tidak dapat dimuat pada perangkat ini.');
            return undefined;
        }

        let isStopped = false;

        scanner
            .start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    if (isStopped) {
                        return;
                    }
                    isStopped = true;
                    onDetectedRef.current(decodedText);
                    stopScanner(scanner).finally(() => onCloseRef.current());
                },
                () => {},
            )
            .catch(() => {
                setError(
                    'Tidak dapat mengakses kamera. Pastikan izin kamera diaktifkan dan perangkat memiliki kamera.',
                );
            });

        return () => {
            isStopped = true;
            stopScanner(scanner);
        };
    }, [open]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Scan Barcode / QR Code"
            description="Arahkan kamera ke barcode atau QR code produk."
            maxWidth="max-w-md"
        >
            {error && (
                <div className="mb-4 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
                <div id={SCANNER_ID} className="w-full [&_video]:w-full" />
            </div>

            <p className="mt-3 text-center text-xs text-slate-400">
                Hasil scan akan otomatis mengisi kolom Kode Barang.
            </p>
        </Modal>
    );
}

async function stopScanner(scanner) {
    try {
        await scanner.stop();
    } catch {
        // Scanner was not running.
    }

    try {
        scanner.clear();
    } catch {
        // Nothing to clear.
    }
}