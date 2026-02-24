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
        host: '0.0.0.0', // Позволяет принимать подключения извне
        port: 5173,
        strictPort: true,
        hmr: {
            //91.205.196.253
            host: 'https://newnewmegastom.test', // Ваш публичный IP
            protocol: 'wss',
        },
        proxy: {
            '/tooths': 'https://newnewmegastom.test',  // Проксируем запросы на изображения
            '/avatars': 'https://newnewmegastom.test',  // Проксируем запросы на изображения
        },
    },
});


