/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        deps: {
            inline: [
                '@farcaster/frame-sdk',
                '@farcaster/auth-kit',
                '@farcaster/frame-wagmi-connector'
            ]
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/test/',
                '**/*.d.ts',
                'vite.config.ts',
                'vitest.config.ts',
                'src/main.tsx'
            ]
        }
    },
}); 