import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { PwaInstallProvider } from './Components/PwaInstallProvider';
import PwaInstallPrompt from './Components/PwaInstallPrompt';

const appName = import.meta.env.VITE_APP_NAME || 'POS Bengkel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(
            <PwaInstallProvider>
                <App {...props} />
                <PwaInstallPrompt />
            </PwaInstallProvider>,
        );
    },
    progress: {
        color: '#16a34a',
    },
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}
