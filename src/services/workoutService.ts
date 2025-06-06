import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { StreakService } from './streakService';

type Workout = Database['public']['Tables']['workouts']['Row'];
type WorkoutUpdate = Database['public']['Tables']['workouts']['Update'];

export interface WorkoutWithUserInfo extends Workout {
    user: {
        username: string | null;
        display_name: string | null;
        pfp_url: string | null;
    };
}

export class WorkoutService {
    /**
     * Log a new workout and update streak
     */
    static async logWorkout(workoutData: {
        user_id: string;
        workout_type: string;
        duration_minutes?: number;
        calories_burned?: number;
        notes?: string;
        completed_at?: Date;
    }): Promise<Workout | null> {
        try {
            const completedAt = workoutData.completed_at || new Date();

            // Insert the workout
            const { data: workout, error: workoutError } = await supabase
                .from('workouts')
                .insert({
                    user_id: workoutData.user_id,
                    workout_type: workoutData.workout_type,
                    duration_minutes: workoutData.duration_minutes,
                    calories_burned: workoutData.calories_burned,
                    notes: workoutData.notes,
                    completed_at: completedAt.toISOString(),
                })
                .select()
                .single();

            if (workoutError) {
                console.error('Error logging workout:', workoutError);
                throw workoutError;
            }

            // Update the user's streak
            await StreakService.updateStreakAfterWorkout(workoutData.user_id, completedAt);

            return workout;
        } catch (error) {
            console.error('Error in logWorkout:', error);
            throw error;
        }
    }

    /**
     * Get user's workout history
     */
    static async getUserWorkouts(
        userId: string,
        options: {
            limit?: number;
            offset?: number;
            startDate?: Date;
            endDate?: Date;
        } = {}
    ): Promise<Workout[]> {
        try {
            let query = supabase
                .from('workouts')
                .select('*')
                .eq('user_id', userId)
                .order('completed_at', { ascending: false });

            if (options.startDate) {
                query = query.gte('completed_at', options.startDate.toISOString());
            }

            if (options.endDate) {
                query = query.lte('completed_at', options.endDate.toISOString());
            }

            if (options.limit) {
                query = query.limit(options.limit);
            }

            if (options.offset) {
                query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error getting user workouts:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Error in getUserWorkouts:', error);
            throw error;
        }
    }

    /**
     * Get recent workouts from all users (activity feed)
     */
    static async getRecentWorkouts(limit: number = 20): Promise<WorkoutWithUserInfo[]> {
        try {
            const { data, error } = await supabase
                .from('workouts')
                .select(`
          *,
          users:user_id (
            username,
            display_name,
            pfp_url
          )
        `)
                .order('completed_at', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('Error getting recent workouts:', error);
                throw error;
            }

            // Transform the data to match our interface
            return data.map(workout => ({
                ...workout,
                user: {
                    username: (workout.users as any)?.username || null,
                    display_name: (workout.users as any)?.display_name || null,
                    pfp_url: (workout.users as any)?.pfp_url || null,
                },
            }));
        } catch (error) {
            console.error('Error in getRecentWorkouts:', error);
            throw error;
        }
    }

    /**
     * Get workout statistics for a user
     */
    static async getUserWorkoutStats(userId: string): Promise<{
        totalWorkouts: number;
        totalDuration: number;
        totalCalories: number;
        workoutTypes: { [key: string]: number };
        monthlyStats: { month: string; count: number }[];
    }> {
        try {
            const { data: workouts, error } = await supabase
                .from('workouts')
                .select('workout_type, duration_minutes, calories_burned, completed_at')
                .eq('user_id', userId);

            if (error) {
                console.error('Error getting user workout stats:', error);
                throw error;
            }

            const stats = {
                totalWorkouts: workouts.length,
                totalDuration: 0,
                totalCalories: 0,
                workoutTypes: {} as { [key: string]: number },
                monthlyStats: [] as { month: string; count: number }[],
            };

            const monthlyCount: { [key: string]: number } = {};

            workouts.forEach(workout => {
                // Sum duration and calories
                stats.totalDuration += workout.duration_minutes || 0;
                stats.totalCalories += workout.calories_burned || 0;

                // Count workout types
                if (stats.workoutTypes[workout.workout_type]) {
                    stats.workoutTypes[workout.workout_type]++;
                } else {
                    stats.workoutTypes[workout.workout_type] = 1;
                }

                // Count monthly workouts
                const date = new Date(workout.completed_at);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (monthlyCount[monthKey]) {
                    monthlyCount[monthKey]++;
                } else {
                    monthlyCount[monthKey] = 1;
                }
            });

            // Convert monthly count to array and sort
            stats.monthlyStats = Object.entries(monthlyCount)
                .map(([month, count]) => ({ month, count }))
                .sort((a, b) => a.month.localeCompare(b.month));

            return stats;
        } catch (error) {
            console.error('Error in getUserWorkoutStats:', error);
            throw error;
        }
    }

    /**
     * Update a workout
     */
    static async updateWorkout(workoutId: string, updates: WorkoutUpdate): Promise<Workout | null> {
        try {
            const { data, error } = await supabase
                .from('workouts')
                .update(updates)
                .eq('id', workoutId)
                .select()
                .single();

            if (error) {
                console.error('Error updating workout:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error in updateWorkout:', error);
            throw error;
        }
    }

    /**
     * Delete a workout
     */
    static async deleteWorkout(workoutId: string, userId: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('workouts')
                .delete()
                .eq('id', workoutId)
                .eq('user_id', userId); // Ensure user can only delete their own workouts

            if (error) {
                console.error('Error deleting workout:', error);
                throw error;
            }

            // Note: This doesn't recalculate streaks. In a production app,
            // you might want to recalculate the user's streak after deletion
            return true;
        } catch (error) {
            console.error('Error in deleteWorkout:', error);
            throw error;
        }
    }

    /**
     * Check if user has worked out today
     */
    static async hasWorkedOutToday(userId: string): Promise<boolean> {
        try {
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

            const { data, error } = await supabase
                .from('workouts')
                .select('id')
                .eq('user_id', userId)
                .gte('completed_at', startOfDay.toISOString())
                .lte('completed_at', endOfDay.toISOString())
                .limit(1);

            if (error) {
                console.error('Error checking today\'s workouts:', error);
                throw error;
            }

            return data.length > 0;
        } catch (error) {
            console.error('Error in hasWorkedOutToday:', error);
            throw error;
        }
    }
} 