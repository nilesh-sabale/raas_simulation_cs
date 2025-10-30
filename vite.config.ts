import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    root: './src/frontend',
    resolve: {
        alias: {
            '@': resolve(__dirname, './src/frontend'),
            '@components': resolve(__dirname, './src/frontend/components'),
            '@pages': resolve(__dirname, './src/frontend/pages'),
            '@hooks': resolve(__dirname, './src/frontend/hooks'),
            '@services': resolve(__dirname, './src/frontend/services'),
            '@store': resolve(__dirname, './src/frontend/store'),
            '@types': resolve(__dirname, './src/frontend/types'),
            '@utils': resolve(__dirname, './src/frontend/utils'),
            '@styles': resolve(__dirname, './src/frontend/styles'),
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
            '/socket.io': {
                target: 'http://localhost:3000',
                ws: true,
            },
        },
    },
    build: {
        outDir: '../../dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    charts: ['recharts'],
                    ui: ['styled-components', 'framer-motion'],
                },
            },
        },
    },
})