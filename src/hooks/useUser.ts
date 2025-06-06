import { useState, useEffect } from 'react';
import { UserService } from '../services/userService';
import type { Database } from '../lib/database.types';

type User = Database['public']['Tables']['users']['Row'];

export function useUser(farcasterID?: number) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const getOrCreateUser = async (farcasterData: {
        farcaster_id: number;
        username?: string;
        display_name?: string;
        bio?: string;
        pfp_url?: string;
    }) => {
        setLoading(true);
        setError(null);

        try {
            const userData = await UserService.getOrCreateUser(farcasterData);
            setUser(userData);
            return userData;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to get or create user');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (userId: string, updates: Partial<User>) => {
        setLoading(true);
        setError(null);

        try {
            const updatedUser = await UserService.updateUser(userId, updates);
            if (updatedUser) {
                setUser(updatedUser);
            }
            return updatedUser;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to update user');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = async (userId: string) => {
        setLoading(true);
        setError(null);

        try {
            const userData = await UserService.getUserById(userId);
            setUser(userData);
            return userData;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch user');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const fetchUserByFarcasterId = async (farcasterID: number) => {
        setLoading(true);
        setError(null);

        try {
            const userData = await UserService.getUserByFarcasterId(farcasterID);
            setUser(userData);
            return userData;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch user by Farcaster ID');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch user if Farcaster ID is provided
    useEffect(() => {
        if (farcasterID) {
            fetchUserByFarcasterId(farcasterID).catch(console.error);
        }
    }, [farcasterID]);

    return {
        user,
        loading,
        error,
        getOrCreateUser,
        updateUser,
        fetchUser,
        fetchUserByFarcasterId,
    };
} 