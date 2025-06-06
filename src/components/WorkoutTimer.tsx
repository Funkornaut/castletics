import { useState, useEffect, useRef } from 'react';

interface Workout {
    name: string;
    category: 'upper' | 'lower' | 'core' | 'full';
    duration: number; // in minutes
    exercises: string[];
}

interface WorkoutTimerProps {
    workout: Workout;
    onWorkoutComplete: () => void;
    disabled?: boolean;
}

type TimerState = 'idle' | 'running' | 'paused' | 'completed';

export function WorkoutTimer({ workout, onWorkoutComplete, disabled = false }: WorkoutTimerProps) {
    const [timerState, setTimerState] = useState<TimerState>('idle');
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const requiredSeconds = workout.duration * 60; // Convert minutes to seconds
    const minRequiredSeconds = Math.max(Math.floor(requiredSeconds * 0.7), 300); // At least 70% of workout time, minimum 5 minutes

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Start timer
    const startTimer = () => {
        setTimerState('running');
        setStartTime(new Date());
        setElapsedSeconds(0);

        intervalRef.current = setInterval(() => {
            setElapsedSeconds(prev => prev + 1);
        }, 1000);
    };

    // Pause timer
    const pauseTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setTimerState('paused');
    };

    // Resume timer
    const resumeTimer = () => {
        setTimerState('running');
        intervalRef.current = setInterval(() => {
            setElapsedSeconds(prev => prev + 1);
        }, 1000);
    };

    // Complete workout
    const completeWorkout = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setTimerState('completed');
        onWorkoutComplete();
    };

    // Reset timer
    const resetTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setTimerState('idle');
        setElapsedSeconds(0);
        setStartTime(null);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Check if workout can be completed
    const canComplete = elapsedSeconds >= minRequiredSeconds;
    const progressPercentage = Math.min((elapsedSeconds / requiredSeconds) * 100, 100);
    const minProgressPercentage = (minRequiredSeconds / requiredSeconds) * 100;

    return (
        <div style={{
            padding: '20px',
            border: '2px solid var(--castletics-teal)',
            borderRadius: '12px',
            background: 'rgba(0, 150, 136, 0.1)',
            margin: '20px 0',
        }}>
            <h3 style={{ margin: '0 0 15px 0', color: 'var(--castletics-teal)' }}>
                Workout Timer
            </h3>

            {/* Timer Display */}
            <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
                margin: '20px 0',
                color: timerState === 'running' ? 'var(--castletics-teal)' : 'var(--castletics-off-white)',
            }}>
                {formatTime(elapsedSeconds)}
            </div>

            {/* Progress Bar */}
            <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                margin: '15px 0',
                overflow: 'hidden',
            }}>
                <div style={{
                    width: `${progressPercentage}%`,
                    height: '100%',
                    backgroundColor: canComplete ? 'var(--castletics-teal)' : '#ff9800',
                    transition: 'width 0.3s ease, background-color 0.3s ease',
                }} />
                {/* Minimum required time marker */}
                <div style={{
                    position: 'relative',
                    top: '-8px',
                    left: `${minProgressPercentage}%`,
                    width: '2px',
                    height: '8px',
                    backgroundColor: 'var(--castletics-off-white)',
                    opacity: 0.7,
                }} />
            </div>

            {/* Status Text */}
            <div style={{
                textAlign: 'center',
                margin: '10px 0',
                fontSize: '0.9rem',
                color: 'var(--castletics-off-white)',
                opacity: 0.8,
            }}>
                {timerState === 'idle' && `Ready to start ${workout.name}`}
                {timerState === 'running' && (
                    canComplete
                        ? '✅ Minimum time reached - you can complete now!'
                        : `⏱️ Keep going! ${formatTime(minRequiredSeconds - elapsedSeconds)} minimum remaining`
                )}
                {timerState === 'paused' && '⏸️ Workout paused'}
                {timerState === 'completed' && '🎉 Workout completed!'}
            </div>

            {/* Control Buttons */}
            <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                flexWrap: 'wrap',
            }}>
                {timerState === 'idle' && (
                    <button
                        onClick={startTimer}
                        disabled={disabled}
                        style={{
                            padding: '12px 24px',
                            background: 'var(--castletics-teal)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            opacity: disabled ? 0.5 : 1,
                        }}
                    >
                        🚀 Start Workout
                    </button>
                )}

                {timerState === 'running' && (
                    <>
                        <button
                            onClick={pauseTimer}
                            style={{
                                padding: '10px 20px',
                                background: '#ff9800',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                            }}
                        >
                            ⏸️ Pause
                        </button>

                        {canComplete && (
                            <button
                                onClick={completeWorkout}
                                style={{
                                    padding: '12px 24px',
                                    background: '#4caf50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    animation: 'pulse 2s infinite',
                                }}
                            >
                                ✅ Complete Workout
                            </button>
                        )}
                    </>
                )}

                {timerState === 'paused' && (
                    <>
                        <button
                            onClick={resumeTimer}
                            style={{
                                padding: '10px 20px',
                                background: 'var(--castletics-teal)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                            }}
                        >
                            ▶️ Resume
                        </button>

                        <button
                            onClick={resetTimer}
                            style={{
                                padding: '10px 20px',
                                background: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                            }}
                        >
                            🔄 Reset
                        </button>

                        {canComplete && (
                            <button
                                onClick={completeWorkout}
                                style={{
                                    padding: '10px 20px',
                                    background: '#4caf50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                }}
                            >
                                ✅ Complete
                            </button>
                        )}
                    </>
                )}

                {timerState === 'completed' && (
                    <button
                        onClick={resetTimer}
                        style={{
                            padding: '10px 20px',
                            background: 'var(--castletics-teal)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                        }}
                    >
                        🔄 New Workout
                    </button>
                )}
            </div>

            {/* Workout Info */}
            <div style={{
                marginTop: '15px',
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px',
                fontSize: '0.85rem',
            }}>
                <div><strong>Target Duration:</strong> {workout.duration} minutes</div>
                <div><strong>Minimum Required:</strong> {Math.floor(minRequiredSeconds / 60)} minutes</div>
                {startTime && (
                    <div><strong>Started:</strong> {startTime.toLocaleTimeString()}</div>
                )}
            </div>

            <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
        </div>
    );
} 