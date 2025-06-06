import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Mock Farcaster Frame SDK
const mockSdk = {
    actions: {
        ready: vi.fn().mockResolvedValue(undefined),
    },
    context: Promise.resolve({
        user: {
            fid: 12345,
            username: 'testuser',
            displayName: 'Test User',
            pfpUrl: 'https://example.com/pfp.jpg'
        },
        client: {
            clientFid: 9152,
            added: false
        }
    })
};

vi.mock('@farcaster/frame-sdk', () => ({
    sdk: mockSdk
}));

// Mock fetch globally
global.fetch = vi.fn();

// Setup fetch mock helper
export const mockFetch = (response: any, ok = true) => {
    (global.fetch as any).mockResolvedValueOnce({
        ok,
        json: async () => response,
    });
};

// Reset all mocks before each test
beforeEach(() => {
    vi.clearAllMocks();
}); 