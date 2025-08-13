import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
	plugins: [react()],
	server: {
		port: 5174,
		proxy: {
			'/api': {
				target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
				changeOrigin: true,
			},
			'/actuator': {
				target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
				changeOrigin: true,
			},
			'/ws': {
				target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
				changeOrigin: true,
			}
		}
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
}); 