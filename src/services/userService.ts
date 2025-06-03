import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export class UserService {
    /**
     * Get or create a user by Farcaster ID
     */
    static async getOrCreateUser(farcasterData: {
        farcaster_id: number;
        username?: string;
        display_name?: string;
        bio?: string;
        pfp_url?: string;
    }): Promise<User | null> {
        try {
            // First, try to find existing user
            const { data: existingUser, error: findError } = await supabase
                .from('users')
                .select('*')
                .eq('farcaster_id', farcasterData.farcaster_id)
                .single();

            if (findError && findError.code !== 'PGRST116') {
                // PGRST116 is "not found" error, which is expected
                console.error('Error finding user:', findError);
                throw findError;
            }

            if (existingUser) {
                // Update existing user with latest data
                const { data: updatedUser, error: updateError } = await supabase
                    .from('users')
                    .update({
                        username: farcasterData.username,
                        display_name: farcasterData.display_name,
                        bio: farcasterData.bio,
                        pfp_url: farcasterData.pfp_url,
                    })
                    .eq('id', existingUser.id)
                    .select()
                    .single();

                if (updateError) {
                    console.error('Error updating user:', updateError);
                    throw updateError;
                }

                return updatedUser;
            }

            // Create new user
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert({
                    farcaster_id: farcasterData.farcaster_id,
                    username: farcasterData.username,
                    display_name: farcasterData.display_name,
                    bio: farcasterData.bio,
                    pfp_url: farcasterData.pfp_url,
                })
                .select()
                .single();

            if (createError) {
                console.error('Error creating user:', createError);
                throw createError;
            }

            // Initialize streak for new user
            await this.initializeUserStreak(newUser.id);

            return newUser;
        } catch (error) {
            console.error('Error in getOrCreateUser:', error);
            throw error;
        }
    }

    /**
     * Get user by ID
     */
    static async getUserById(userId: string): Promise<User | null> {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error getting user by ID:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error in getUserById:', error);
            throw error;
        }
    }

    /**
     * Get user by Farcaster ID
     */
    static async getUserByFarcasterId(farcasterID: number): Promise<User | null> {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('farcaster_id', farcasterID)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error getting user by Farcaster ID:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error in getUserByFarcasterId:', error);
            throw error;
        }
    }

    /**
     * Update user profile
     */
    static async updateUser(userId: string, updates: UserUpdate): Promise<User | null> {
        try {
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();

            if (error) {
                console.error('Error updating user:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error in updateUser:', error);
            throw error;
        }
    }

    /**
     * Initialize streak record for a new user
     */
    private static async initializeUserStreak(userId: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('streaks')
                .insert({
                    user_id: userId,
                    current_streak: 0,
                    longest_streak: 0,
                    last_workout_date: null,
                });

            if (error) {
                console.error('Error initializing user streak:', error);
                throw error;
            }
        } catch (error) {
            console.error('Error in initializeUserStreak:', error);
            throw error;
        }
    }
} 