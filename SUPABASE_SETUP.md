# Supabase Setup Guide

This guide will help you set up Supabase for the Castletics project to handle user data and workout streaks.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in your project details:
   - **Name**: `castletics` (or your preferred name)
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose the region closest to your users
5. Click "Create new project"

## Step 2: Get Your Project Credentials

1. Once your project is created, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://your-project-id.supabase.co`)
   - **Project API Keys** → **anon public** key

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Replace the values with your actual Supabase credentials
3. Make sure `.env.local` is in your `.gitignore` file (it should be already)

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run" to execute the schema

This will create:
- `users` table for storing Farcaster user profiles
- `streaks` table for tracking workout streaks
- `workouts` table for logging individual workouts
- Proper indexes for performance
- Row Level Security (RLS) policies for data protection

## Step 5: Configure Row Level Security (Optional)

The schema includes basic RLS policies, but you may want to customize them:

1. Go to **Authentication** → **Policies**
2. You'll see policies for each table
3. Modify as needed for your security requirements

For development, the current policies allow:
- Public read access to user profiles
- Users can only modify their own data
- Automatic data isolation by user ID

## Step 6: Test the Connection

1. Start your development server: `npm run dev`
2. Check the browser console for any Supabase connection errors
3. If you see "Missing Supabase environment variables" error, double-check your `.env.local` file

## Database Structure

### Users Table
Stores Farcaster user information:
- `id`: UUID primary key
- `farcaster_id`: Unique Farcaster ID
- `username`, `display_name`, `bio`, `pfp_url`: Profile information
- `created_at`, `updated_at`: Timestamps

### Streaks Table  
Tracks workout streaks:
- `id`: UUID primary key
- `user_id`: Foreign key to users table
- `current_streak`: Current consecutive workout days
- `longest_streak`: Personal best streak
- `last_workout_date`: Date of last workout
- `created_at`, `updated_at`: Timestamps

### Workouts Table
Logs individual workouts:
- `id`: UUID primary key
- `user_id`: Foreign key to users table
- `workout_type`: Type of workout performed
- `duration_minutes`: Workout duration (optional)
- `calories_burned`: Calories burned (optional)
- `notes`: User notes (optional)
- `completed_at`: When the workout was completed
- `created_at`: When the record was created

## Available Services

The project includes three service classes for database operations:

### UserService
- `getOrCreateUser()`: Find or create user by Farcaster ID
- `getUserById()`: Get user by UUID
- `getUserByFarcasterId()`: Get user by Farcaster ID
- `updateUser()`: Update user profile

### StreakService
- `getUserStreak()`: Get user's streak data
- `updateStreakAfterWorkout()`: Update streak after logging workout
- `checkAndUpdateStreakStatus()`: Check and break streaks (for daily jobs)
- `getStreakLeaderboard()`: Get top streaks for leaderboard
- `resetUserStreak()`: Reset user's streak

### WorkoutService
- `logWorkout()`: Log new workout and update streak
- `getUserWorkouts()`: Get user's workout history
- `getRecentWorkouts()`: Get recent workouts from all users
- `getUserWorkoutStats()`: Get user's workout statistics
- `updateWorkout()`: Update existing workout
- `deleteWorkout()`: Delete workout
- `hasWorkedOutToday()`: Check if user worked out today

## Environment Variables Reference

```bash
# Required for Supabase connection
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# Optional: For server-side operations (if needed later)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Next Steps

1. Set up authentication integration with Farcaster Auth Kit
2. Implement the UI components to use these services
3. Add error handling and loading states
4. Consider adding real-time subscriptions for live updates
5. Set up database backups and monitoring

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check that `.env.local` exists and has correct variable names
   - Restart your dev server after creating/modifying `.env.local`

2. **Database connection errors**
   - Verify your Supabase project URL and API key
   - Check that your Supabase project is active and not paused

3. **Permission denied errors**
   - Check your RLS policies in the Supabase dashboard
   - Ensure you're using the correct authentication context

4. **Schema migration issues**
   - Make sure you ran the SQL migration in the correct order
   - Check the Supabase SQL Editor for any error messages

## Production Considerations

1. **Security**: Review and tighten RLS policies
2. **Performance**: Add appropriate database indexes
3. **Monitoring**: Set up alerts for database performance
4. **Backups**: Configure automated backups
5. **Scaling**: Monitor usage and upgrade plan as needed 