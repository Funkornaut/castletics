import { useState, useEffect } from 'react';
import { WorkoutService, type WorkoutWithUserInfo } from '../services/workoutService';
import type { Database } from '../lib/database.types';

type Workout = Database['public']['Tables']['workouts']['Row'];

export function useWorkouts(userId?: string) {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const logWorkout = async (workoutData: {
        user_id: string;
        workout_type: string;
        duration_minutes?: number;
        calories_burned?: number;
        notes?: string;
        completed_at?: Date;
    }) => {
        setLoading(true);
        setError(null);

        try {
            const workout = await WorkoutService.logWorkout(workoutData);
            if (workout) {
                setWorkouts(prev => [workout, ...prev]);
            }
            return workout;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to log workout');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkouts = async (targetUserId: string, options?: {
        limit?: number;
        offset?: number;
        startDate?: Date;
        endDate?: Date;
    }) => {
        setLoading(true);
        setError(null);

        try {
            const data = await WorkoutService.getUserWorkouts(targetUserId, options);
            setWorkouts(data);
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch workouts');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateWorkout = async (workoutId: string, updates: Partial<Workout>) => {
        setLoading(true);
        setError(null);

        try {
            const updatedWorkout = await WorkoutService.updateWorkout(workoutId, updates);
            if (updatedWorkout) {
                setWorkouts(prev =>
                    prev.map(w => w.id === workoutId ? updatedWorkout : w)
                );
            }
            return updatedWorkout;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to update workout');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteWorkout = async (workoutId: string, targetUserId: string) => {
        setLoading(true);
        setError(null);

        try {
            const success = await WorkoutService.deleteWorkout(workoutId, targetUserId);
            if (success) {
                setWorkouts(prev => prev.filter(w => w.id !== workoutId));
            }
            return success;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to delete workout');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch workouts if userId is provided
    useEffect(() => {
        if (userId) {
            fetchWorkouts(userId).catch(console.error);
        }
    }, [userId]);

    return {
        workouts,
        loading,
        error,
        logWorkout,
        fetchWorkouts,
        updateWorkout,
        deleteWorkout,
    };
}

export function useWorkoutStats(userId?: string) {
    const [stats, setStats] = useState<{
        totalWorkouts: number;
        totalDuration: number;
        totalCalories: number;
        workoutTypes: { [key: string]: number };
        monthlyStats: { month: string; count: number }[];
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchStats = async (targetUserId: string) => {
        setLoading(true);
        setError(null);

        try {
            const data = await WorkoutService.getUserWorkoutStats(targetUserId);
            setStats(data);
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch workout stats');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch stats if userId is provided
    useEffect(() => {
        if (userId) {
            fetchStats(userId).catch(console.error);
        }
    }, [userId]);

    return {
        stats,
        loading,
        error,
        fetchStats,
    };
}

export function useRecentWorkouts(limit: number = 20) {
    const [recentWorkouts, setRecentWorkouts] = useState<WorkoutWithUserInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchRecentWorkouts = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await WorkoutService.getRecentWorkouts(limit);
            setRecentWorkouts(data);
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch recent workouts');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch recent workouts on mount
    useEffect(() => {
        fetchRecentWorkouts().catch(console.error);
    }, [limit]);

    return {
        recentWorkouts,
        loading,
        error,
        fetchRecentWorkouts,
    };
}

export function useWorkoutStatus(userId?: string) {
    const [hasWorkedOutToday, setHasWorkedOutToday] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const checkWorkoutStatus = async (targetUserId: string) => {
        setLoading(true);
        setError(null);

        try {
            const status = await WorkoutService.hasWorkedOutToday(targetUserId);
            setHasWorkedOutToday(status);
            return status;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to check workout status');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Auto-check status if userId is provided
    useEffect(() => {
        if (userId) {
            checkWorkoutStatus(userId).catch(console.error);
        }
    }, [userId]);

    return {
        hasWorkedOutToday,
        loading,
        error,
        checkWorkoutStatus,
    };
} 