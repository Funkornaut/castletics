import { useState, useEffect } from 'react';
import { StreakService } from '../services/streakService';
import type { Database } from '../lib/database.types';

type Streak = Database['public']['Tables']['streaks']['Row'];

export function useStreak(userId?: string) {
    const [streak, setStreak] = useState<Streak | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchStreak = async (targetUserId: string) => {
        setLoading(true);
        setError(null);

        try {
            const streakData = await StreakService.getUserStreak(targetUserId);
            setStreak(streakData);
            return streakData;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch streak');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateStreakAfterWorkout = async (targetUserId: string, workoutDate: Date = new Date()) => {
        setLoading(true);
        setError(null);

        try {
            const updatedStreak = await StreakService.updateStreakAfterWorkout(targetUserId, workoutDate);
            if (updatedStreak) {
                setStreak(updatedStreak);
            }
            return updatedStreak;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to update streak');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const checkStreakStatus = async (targetUserId: string) => {
        setLoading(true);
        setError(null);

        try {
            const updatedStreak = await StreakService.checkAndUpdateStreakStatus(targetUserId);
            if (updatedStreak) {
                setStreak(updatedStreak);
            }
            return updatedStreak;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to check streak status');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const resetStreak = async (targetUserId: string) => {
        setLoading(true);
        setError(null);

        try {
            const resetStreak = await StreakService.resetUserStreak(targetUserId);
            if (resetStreak) {
                setStreak(resetStreak);
            }
            return resetStreak;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to reset streak');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch streak if userId is provided
    useEffect(() => {
        if (userId) {
            fetchStreak(userId).catch(console.error);
        }
    }, [userId]);

    return {
        streak,
        loading,
        error,
        fetchStreak,
        updateStreakAfterWorkout,
        checkStreakStatus,
        resetStreak,
    };
}

export function useStreakLeaderboard(limit: number = 10) {
    const [leaderboard, setLeaderboard] = useState<(Streak & { username: string; display_name: string })[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchLeaderboard = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await StreakService.getStreakLeaderboard(limit);
            setLeaderboard(data);
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch leaderboard');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch leaderboard on mount
    useEffect(() => {
        fetchLeaderboard().catch(console.error);
    }, [limit]);

    return {
        leaderboard,
        loading,
        error,
        fetchLeaderboard,
    };
} 