// resources/js/app.jsx
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './components/init.jsx';
import '../css/app.css';
import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import 'alertifyjs/build/css/alertify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';



const appName = import.meta.env.VITE_APP_NAME || 'Megastom';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx')
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
                <App {...props} />
        );
    },
    progress: {
        color: '#4B5563',
    },
});
