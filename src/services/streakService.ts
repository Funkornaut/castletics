import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Streak = Database['public']['Tables']['streaks']['Row'];
type StreakUpdate = Database['public']['Tables']['streaks']['Update'];

export class StreakService {
    /**
     * Get user's streak data
     */
    static async getUserStreak(userId: string): Promise<Streak | null> {
        try {
            const { data, error } = await supabase
                .from('streaks')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error getting user streak:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error in getUserStreak:', error);
            throw error;
        }
    }

    /**
     * Update user's streak after a workout
     */
    static async updateStreakAfterWorkout(userId: string, workoutDate: Date): Promise<Streak | null> {
        try {
            const streak = await this.getUserStreak(userId);
            if (!streak) {
                throw new Error('Streak record not found for user');
            }

            const today = new Date();
            const workoutDateOnly = new Date(workoutDate.getFullYear(), workoutDate.getMonth(), workoutDate.getDate());
            const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            let newCurrentStreak = streak.current_streak;
            let newLongestStreak = streak.longest_streak;

            // Check if this is the first workout or if it's been more than a day
            if (!streak.last_workout_date) {
                // First workout ever
                newCurrentStreak = 1;
            } else {
                const lastWorkoutDate = new Date(streak.last_workout_date);
                const daysSinceLastWorkout = Math.floor((workoutDateOnly.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24));

                if (daysSinceLastWorkout === 0) {
                    // Same day workout, don't change streak
                    newCurrentStreak = streak.current_streak;
                } else if (daysSinceLastWorkout === 1) {
                    // Consecutive day, increment streak
                    newCurrentStreak = streak.current_streak + 1;
                } else {
                    // Gap in workouts, restart streak
                    newCurrentStreak = 1;
                }
            }

            // Update longest streak if current streak is higher
            if (newCurrentStreak > newLongestStreak) {
                newLongestStreak = newCurrentStreak;
            }

            // Update the streak record
            const { data: updatedStreak, error: updateError } = await supabase
                .from('streaks')
                .update({
                    current_streak: newCurrentStreak,
                    longest_streak: newLongestStreak,
                    last_workout_date: workoutDateOnly.toISOString().split('T')[0], // Format as YYYY-MM-DD
                })
                .eq('user_id', userId)
                .select()
                .single();

            if (updateError) {
                console.error('Error updating streak:', updateError);
                throw updateError;
            }

            return updatedStreak;
        } catch (error) {
            console.error('Error in updateStreakAfterWorkout:', error);
            throw error;
        }
    }

    /**
     * Check if user's streak should be broken (called daily)
     */
    static async checkAndUpdateStreakStatus(userId: string): Promise<Streak | null> {
        try {
            const streak = await this.getUserStreak(userId);
            if (!streak || !streak.last_workout_date) {
                return streak;
            }

            const today = new Date();
            const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const lastWorkoutDate = new Date(streak.last_workout_date);
            const daysSinceLastWorkout = Math.floor((todayOnly.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24));

            // If it's been more than 1 day since last workout, break the streak
            if (daysSinceLastWorkout > 1 && streak.current_streak > 0) {
                const { data: updatedStreak, error } = await supabase
                    .from('streaks')
                    .update({
                        current_streak: 0,
                    })
                    .eq('user_id', userId)
                    .select()
                    .single();

                if (error) {
                    console.error('Error breaking streak:', error);
                    throw error;
                }

                return updatedStreak;
            }

            return streak;
        } catch (error) {
            console.error('Error in checkAndUpdateStreakStatus:', error);
            throw error;
        }
    }

    /**
     * Get streak statistics for multiple users (leaderboard)
     */
    static async getStreakLeaderboard(limit: number = 10): Promise<(Streak & { username: string; display_name: string })[]> {
        try {
            const { data, error } = await supabase
                .from('streaks')
                .select(`
          *,
          users:user_id (
            username,
            display_name
          )
        `)
                .order('current_streak', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('Error getting streak leaderboard:', error);
                throw error;
            }

            // Transform the data to flatten the user info
            return data.map(streak => ({
                ...streak,
                username: (streak.users as any)?.username || '',
                display_name: (streak.users as any)?.display_name || '',
            }));
        } catch (error) {
            console.error('Error in getStreakLeaderboard:', error);
            throw error;
        }
    }

    /**
     * Reset user's streak (admin function or user choice)
     */
    static async resetUserStreak(userId: string): Promise<Streak | null> {
        try {
            const { data, error } = await supabase
                .from('streaks')
                .update({
                    current_streak: 0,
                    last_workout_date: null,
                })
                .eq('user_id', userId)
                .select()
                .single();

            if (error) {
                console.error('Error resetting user streak:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error in resetUserStreak:', error);
            throw error;
        }
    }
} 