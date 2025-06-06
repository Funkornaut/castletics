export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    farcaster_id: number
                    username: string | null
                    display_name: string | null
                    bio: string | null
                    pfp_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    farcaster_id: number
                    username?: string | null
                    display_name?: string | null
                    bio?: string | null
                    pfp_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    farcaster_id?: number
                    username?: string | null
                    display_name?: string | null
                    bio?: string | null
                    pfp_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            streaks: {
                Row: {
                    id: string
                    user_id: string
                    current_streak: number
                    longest_streak: number
                    last_workout_date: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    current_streak?: number
                    longest_streak?: number
                    last_workout_date?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    current_streak?: number
                    longest_streak?: number
                    last_workout_date?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "streaks_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            workouts: {
                Row: {
                    id: string
                    user_id: string
                    workout_type: string
                    duration_minutes: number | null
                    calories_burned: number | null
                    notes: string | null
                    completed_at: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    workout_type: string
                    duration_minutes?: number | null
                    calories_burned?: number | null
                    notes?: string | null
                    completed_at?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    workout_type?: string
                    duration_minutes?: number | null
                    calories_burned?: number | null
                    notes?: string | null
                    completed_at?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "workouts_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
} 