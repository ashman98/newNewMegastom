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
    server: {
        // port: 5173,
        // strictPort: true,
        hmr: {
            //91.205.196.253
            host: 'newnewmegastom.test', // Ваш публичный IP
            // protocol: 'wss',
        },
        host: 'newnewmegastom.test',
        // hmr: {
        //     host: 'newnewmegastom.test',
        // },
        // If you are using Valet with SSL, you need this:
        https: true,
        proxy: {
            '/tooths': 'newnewmegastom.test',  // Проксируем запросы на изображения
            '/avatars':'newnewmegastom.test',  // Проксируем запросы на изображения
        },
    },
});


