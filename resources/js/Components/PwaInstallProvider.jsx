import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

const PwaInstallContext = createContext(null);

const DISMISS_KEY = 'pwa:install-dismissed-at';
const DISMISS_COOLDOWN = 1000 * 60 * 60 * 24 * 7;

let deferredPrompt = null;
const listeners = new Set();

function notifyPromptChange() {
    listeners.forEach((listener) => listener());
}

if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        deferredPrompt = event;
        notifyPromptChange();
    });

    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        notifyPromptChange();
    });
}

function detectPlatform() {
    if (typeof navigator === 'undefined') {
        return 'unknown';
    }

    const userAgent = navigator.userAgent || '';
    const isIos =
        /iphone|ipad|ipod/i.test(userAgent) ||
        (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1);

    if (isIos) {
        return 'ios';
    }

    if (/android/i.test(userAgent)) {
        return 'android';
    }

    return 'desktop';
}

function isStandalone() {
    if (typeof window === 'undefined') {
        return false;
    }

    return (
        window.matchMedia?.('(display-mode: standalone)').matches === true ||
        window.matchMedia?.('(display-mode: window-controls-overlay)').matches ===
            true ||
        window.navigator.standalone === true
    );
}

function readDismissedAt() {
    if (typeof window === 'undefined') {
        return 0;
    }

    const value = Number(window.localStorage.getItem(DISMISS_KEY));

    return Number.isFinite(value) ? value : 0;
}

export function PwaInstallProvider({ children }) {
    const [promptEvent, setPromptEvent] = useState(deferredPrompt);
    const [installed, setInstalled] = useState(() => isStandalone());
    const [platform] = useState(() => detectPlatform());
    const [dismissedAt, setDismissedAt] = useState(() => readDismissedAt());
    const [manualOpen, setManualOpen] = useState(false);

    useEffect(() => {
        const sync = () => setPromptEvent(deferredPrompt);

        listeners.add(sync);
        sync();

        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        const handleDisplayChange = (event) => {
            if (event.matches) {
                setInstalled(true);
            }
        };

        mediaQuery.addEventListener?.('change', handleDisplayChange);

        return () => {
            listeners.delete(sync);
            mediaQuery.removeEventListener?.('change', handleDisplayChange);
        };
    }, []);

    const promptInstall = useCallback(async () => {
        if (!deferredPrompt) {
            return 'unavailable';
        }

        deferredPrompt.prompt();

        const choice = await deferredPrompt.userChoice;

        if (choice?.outcome === 'accepted') {
            setInstalled(true);
        }

        deferredPrompt = null;
        setPromptEvent(null);

        return choice?.outcome ?? 'dismissed';
    }, []);

    const dismiss = useCallback(() => {
        const now = Date.now();

        window.localStorage.setItem(DISMISS_KEY, String(now));
        setDismissedAt(now);
    }, []);

    const resetDismiss = useCallback(() => {
        window.localStorage.removeItem(DISMISS_KEY);
        setDismissedAt(0);
    }, []);

    const value = useMemo(() => {
        const canInstall = Boolean(promptEvent);

        return {
            platform,
            installed,
            canInstall,
            isIos: platform === 'ios',
            recentlyDismissed: Date.now() - dismissedAt < DISMISS_COOLDOWN,
            promptInstall,
            dismiss,
            resetDismiss,
            manualOpen,
            openManual: () => setManualOpen(true),
            closeManual: () => setManualOpen(false),
        };
    }, [
        platform,
        installed,
        promptEvent,
        dismissedAt,
        promptInstall,
        dismiss,
        resetDismiss,
        manualOpen,
    ]);

    return (
        <PwaInstallContext.Provider value={value}>
            {children}
        </PwaInstallContext.Provider>
    );
}

export function usePwaInstall() {
    const context = useContext(PwaInstallContext);

    if (!context) {
        throw new Error(
            'usePwaInstall must be used within a PwaInstallProvider.',
        );
    }

    return context;
}
