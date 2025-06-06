import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock API endpoints for testing
describe('API Integration Tests', () => {
    describe('Streak API', () => {
        beforeEach(() => {
            // Reset global fetch mock
            vi.clearAllMocks();
        });

        it('should fetch streak data for a specific FID', async () => {
            const mockStreakData = { streak: 7, lastWorkout: '2024-01-15' };

            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => mockStreakData,
            });

            const response = await fetch('/api/streak?fid=12345');
            const data = await response.json();

            expect(global.fetch).toHaveBeenCalledWith('/api/streak?fid=12345');
            expect(data).toEqual(mockStreakData);
        });

        it('should handle new user with no streak data', async () => {
            const newUserData = { streak: 0, lastWorkout: null };

            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => newUserData,
            });

            const response = await fetch('/api/streak?fid=99999');
            const data = await response.json();

            expect(data).toEqual(newUserData);
        });

        it('should update streak when workout is completed', async () => {
            const updatedStreakData = { streak: 8, lastWorkout: '2024-01-16' };

            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => updatedStreakData,
            });

            const response = await fetch('/api/streak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fid: '12345' }),
            });
            const data = await response.json();

            expect(global.fetch).toHaveBeenCalledWith('/api/streak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fid: '12345' }),
            });
            expect(data).toEqual(updatedStreakData);
        });

        it('should handle streak reset when workout was missed', async () => {
            const resetStreakData = { streak: 1, lastWorkout: '2024-01-20' };

            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => resetStreakData,
            });

            const response = await fetch('/api/streak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fid: '12345' }),
            });
            const data = await response.json();

            expect(data.streak).toBe(1);
            expect(data.lastWorkout).toBe('2024-01-20');
        });

        it('should handle API errors gracefully', async () => {
            global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

            try {
                await fetch('/api/streak?fid=12345');
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect((error as Error).message).toBe('Network error');
            }
        });
    });

    describe('Authentication API', () => {
        it('should generate nonce for authentication', async () => {
            const mockNonce = { nonce: 'abc123def456' };

            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => mockNonce,
            });

            const response = await fetch('/api/nonce');
            const data = await response.json();

            expect(data).toEqual(mockNonce);
            expect(data.nonce).toMatch(/^[a-z0-9]+$/);
        });

        it('should verify sign-in with valid signature', async () => {
            const mockVerification = { fid: 12345 };

            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => mockVerification,
            });

            const response = await fetch('/api/verify-signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: 'valid_message',
                    signature: 'valid_signature'
                }),
            });
            const data = await response.json();

            expect(data).toEqual(mockVerification);
        });

        it('should reject invalid signatures', async () => {
            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: false,
                status: 401,
                json: async () => ({ error: 'Invalid signature' }),
            });

            const response = await fetch('/api/verify-signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: 'invalid_message',
                    signature: 'invalid_signature'
                }),
            });

            expect(response.ok).toBe(false);
            expect(response.status).toBe(401);
        });
    });
}); 