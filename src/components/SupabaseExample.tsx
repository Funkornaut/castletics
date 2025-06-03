import { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { useStreak } from '../hooks/useStreak';
import { useWorkouts } from '../hooks/useWorkouts';

/**
 * Example component demonstrating Supabase integration
 * This shows how to use the services and hooks we've created
 */
export function SupabaseExample() {
    const [farcasterID, setFarcasterID] = useState<number | undefined>();
    const [userId, setUserId] = useState<string>('');

    const { user, loading: userLoading, error: userError, getOrCreateUser } = useUser();
    const { streak, loading: streakLoading, error: streakError } = useStreak(userId);
    const { workouts, loading: workoutsLoading, error: workoutsError, logWorkout } = useWorkouts(userId);

    const handleCreateUser = async () => {
        if (!farcasterID) return;

        try {
            const userData = await getOrCreateUser({
                farcaster_id: farcasterID,
                username: `user${farcasterID}`,
                display_name: `Test User ${farcasterID}`,
                bio: 'Test bio from Supabase integration',
                pfp_url: 'https://via.placeholder.com/150',
            });

            if (userData) {
                setUserId(userData.id);
            }
        } catch (error) {
            console.error('Failed to create user:', error);
        }
    };

    const handleLogWorkout = async () => {
        if (!userId) return;

        try {
            await logWorkout({
                user_id: userId,
                workout_type: 'Running',
                duration_minutes: 30,
                calories_burned: 300,
                notes: 'Great run in the park!',
            });
        } catch (error) {
            console.error('Failed to log workout:', error);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Supabase Integration Example</h2>

            {/* User Creation Section */}
            <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h3>1. Create/Get User</h3>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="number"
                        placeholder="Enter Farcaster ID"
                        value={farcasterID || ''}
                        onChange={(e) => setFarcasterID(Number(e.target.value) || undefined)}
                        style={{ marginRight: '10px', padding: '5px' }}
                    />
                    <button onClick={handleCreateUser} disabled={userLoading || !farcasterID}>
                        {userLoading ? 'Loading...' : 'Get/Create User'}
                    </button>
                </div>

                {userError && <p style={{ color: 'red' }}>Error: {userError.message}</p>}

                {user && (
                    <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                        <strong>User Created:</strong>
                        <ul style={{ margin: '5px 0' }}>
                            <li>ID: {user.id}</li>
                            <li>Farcaster ID: {user.farcaster_id}</li>
                            <li>Username: {user.username}</li>
                            <li>Display Name: {user.display_name}</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Streak Section */}
            {userId && (
                <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <h3>2. User Streak</h3>

                    {streakLoading && <p>Loading streak...</p>}
                    {streakError && <p style={{ color: 'red' }}>Error: {streakError.message}</p>}

                    {streak && (
                        <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                            <strong>Streak Info:</strong>
                            <ul style={{ margin: '5px 0' }}>
                                <li>Current Streak: {streak.current_streak} days</li>
                                <li>Longest Streak: {streak.longest_streak} days</li>
                                <li>Last Workout: {streak.last_workout_date || 'Never'}</li>
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Workout Section */}
            {userId && (
                <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <h3>3. Log Workout</h3>

                    <button onClick={handleLogWorkout} disabled={workoutsLoading}>
                        {workoutsLoading ? 'Logging...' : 'Log Sample Workout'}
                    </button>

                    {workoutsError && <p style={{ color: 'red' }}>Error: {workoutsError.message}</p>}

                    {workouts.length > 0 && (
                        <div style={{ marginTop: '15px' }}>
                            <strong>Recent Workouts:</strong>
                            <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '10px' }}>
                                {workouts.map((workout) => (
                                    <div key={workout.id} style={{
                                        background: '#f5f5f5',
                                        padding: '10px',
                                        marginBottom: '10px',
                                        borderRadius: '4px'
                                    }}>
                                        <div><strong>{workout.workout_type}</strong></div>
                                        <div>Duration: {workout.duration_minutes} minutes</div>
                                        <div>Calories: {workout.calories_burned}</div>
                                        <div>Notes: {workout.notes}</div>
                                        <div>Date: {new Date(workout.completed_at).toLocaleDateString()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Instructions */}
            <div style={{ marginTop: '30px', padding: '15px', background: '#e7f3ff', borderRadius: '8px' }}>
                <h3>How to Use:</h3>
                <ol>
                    <li>Enter a Farcaster ID and click "Get/Create User"</li>
                    <li>This will create a user in the database and show their streak info</li>
                    <li>Click "Log Sample Workout" to log a workout and update the streak</li>
                    <li>The streak counter should increment if it's a consecutive day</li>
                </ol>

                <p><strong>Note:</strong> Make sure you have set up your Supabase credentials in <code>.env.local</code> file as described in <code>SUPABASE_SETUP.md</code></p>
            </div>
        </div>
    );
} 