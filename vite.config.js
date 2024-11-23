import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',  // Добавление алиаса для удобных импортов
        },
    },
    build: {
        outDir: 'public/build',  // Папка для выходных файлов
        manifest: true,
        emptyOutDir: true,
    },
    server: {
        host: '0.0.0.0', // Позволяет принимать подключения извне
        port: 5173,
        strictPort: true,
        hmr: {
            host: '91.205.196.253', // Ваш публичный IP
            //91.205.196.253
            protocol: 'ws',
        },
    },
});
