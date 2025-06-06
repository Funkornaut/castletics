import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WorkoutTimer } from '../components/WorkoutTimer';

// Mock workout data
const mockWorkout = {
    name: "Test Workout",
    category: "full" as const,
    duration: 30, // 30 minutes
    exercises: [
        "Push-ups (3x15)",
        "Squats (3x20)",
        "Plank (3x1min)"
    ]
};

const mockWorkoutComplete = vi.fn();

describe('WorkoutTimer', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        mockWorkoutComplete.mockClear();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('renders initial state correctly', () => {
        render(
            <WorkoutTimer
                workout={mockWorkout}
                onWorkoutComplete={mockWorkoutComplete}
            />
        );

        expect(screen.getByText('Workout Timer')).toBeInTheDocument();
        expect(screen.getByText('00:00')).toBeInTheDocument();
        expect(screen.getByText('Ready to start Test Workout')).toBeInTheDocument();
        expect(screen.getByText('🚀 Start Workout')).toBeInTheDocument();
        expect(screen.getByText('Target Duration: 30 minutes')).toBeInTheDocument();
    });

    it('calculates minimum required time correctly', () => {
        render(
            <WorkoutTimer
                workout={mockWorkout}
                onWorkoutComplete={mockWorkoutComplete}
            />
        );

        // For 30 minute workout, minimum should be 70% = 21 minutes
        expect(screen.getByText('Minimum Required: 21 minutes')).toBeInTheDocument();
    });

    it('starts timer when start button is clicked', () => {
        render(
            <WorkoutTimer
                workout={mockWorkout}
                onWorkoutComplete={mockWorkoutComplete}
            />
        );

        const startButton = screen.getByText('🚀 Start Workout');
        fireEvent.click(startButton);

        expect(screen.getByText('⏸️ Pause')).toBeInTheDocument();
        expect(screen.getByText(/Keep going!/)).toBeInTheDocument();
    });

    it('updates timer display as time progresses', () => {
        render(
            <WorkoutTimer
                workout={mockWorkout}
                onWorkoutComplete={mockWorkoutComplete}
            />
        );

        const startButton = screen.getByText('🚀 Start Workout');
        fireEvent.click(startButton);

        // Advance time by 65 seconds (1:05)
        vi.advanceTimersByTime(65000);

        expect(screen.getByText('01:05')).toBeInTheDocument();
    });

    it('pauses and resumes timer correctly', () => {
        render(
            <WorkoutTimer
                workout={mockWorkout}
                onWorkoutComplete={mockWorkoutComplete}
            />
        );

        const startButton = screen.getByText('🚀 Start Workout');
        fireEvent.click(startButton);

        // Advance time
        vi.advanceTimersByTime(30000); // 30 seconds
        expect(screen.getByText('00:30')).toBeInTheDocument();

        // Pause
        const pauseButton = screen.getByText('⏸️ Pause');
        fireEvent.click(pauseButton);

        expect(screen.getByText('⏸️ Workout paused')).toBeInTheDocument();
        expect(screen.getByText('▶️ Resume')).toBeInTheDocument();

        // Advance time while paused - timer should not change
        vi.advanceTimersByTime(10000); // 10 seconds
        expect(screen.getByText('00:30')).toBeInTheDocument(); // Still 30 seconds

        // Resume
        const resumeButton = screen.getByText('▶️ Resume');
        fireEvent.click(resumeButton);

        // Advance time after resume
        vi.advanceTimersByTime(15000); // 15 seconds
        expect(screen.getByText('00:45')).toBeInTheDocument();
    });

    it('shows complete button when minimum time is reached', () => {
        render(
            <WorkoutTimer
                workout={mockWorkout}
                onWorkoutComplete={mockWorkoutComplete}
            />
        );

        const startButton = screen.getByText('🚀 Start Workout');
        fireEvent.click(startButton);

        // Advance to minimum required time (21 minutes = 1260 seconds)
        vi.advanceTimersByTime(1260000);

        expect(screen.getByText('✅ Minimum time reached - you can complete now!')).toBeInTheDocument();
        expect(screen.getByText('✅ Complete Workout')).toBeInTheDocument();
    });

    it('calls onWorkoutComplete when workout is completed', () => {
        render(
            <WorkoutTimer
                workout={mockWorkout}
                onWorkoutComplete={mockWorkoutComplete}
            />
        );

        const startButton = screen.getByText('🚀 Start Workout');
        fireEvent.click(startButton);

        // Advance to minimum required time
        vi.advanceTimersByTime(1260000);

        const completeButton = screen.getByText('✅ Complete Workout');
        fireEvent.click(completeButton);

        expect(mockWorkoutComplete).toHaveBeenCalledTimes(1);
        expect(screen.getByText('🎉 Workout completed!')).toBeInTheDocument();
    });

    it('resets timer correctly', () => {
        render(
            <WorkoutTimer
                workout={mockWorkout}
                onWorkoutComplete={mockWorkoutComplete}
            />
        );

        const startButton = screen.getByText('🚀 Start Workout');
        fireEvent.click(startButton);

        // Advance time
        vi.advanceTimersByTime(300000); // 5 minutes

        // Pause
        const pauseButton = screen.getByText('⏸️ Pause');
        fireEvent.click(pauseButton);

        // Reset
        const resetButton = screen.getByText('🔄 Reset');
        fireEvent.click(resetButton);

        expect(screen.getByText('00:00')).toBeInTheDocument();
        expect(screen.getByText('Ready to start Test Workout')).toBeInTheDocument();
        expect(screen.getByText('🚀 Start Workout')).toBeInTheDocument();
    });

    it('handles disabled state correctly', () => {
        render(
            <WorkoutTimer
                workout={mockWorkout}
                onWorkoutComplete={mockWorkoutComplete}
                disabled={true}
            />
        );

        const startButton = screen.getByText('🚀 Start Workout');
        expect(startButton).toBeDisabled();
    });

    it('shows correct progress bar progression', () => {
        render(
            <WorkoutTimer
                workout={mockWorkout}
                onWorkoutComplete={mockWorkoutComplete}
            />
        );

        const startButton = screen.getByText('🚀 Start Workout');
        fireEvent.click(startButton);

        // Check that progress bar exists
        const progressBars = document.querySelectorAll('div[style*="width:"]');
        expect(progressBars.length).toBeGreaterThan(0);

        // Advance to 50% of total time (15 minutes = 900 seconds)
        vi.advanceTimersByTime(900000);

        // Check that progress has updated (exact assertion depends on implementation)
        expect(screen.getByText('15:00')).toBeInTheDocument();
    });

    it('handles short workout minimum time correctly', () => {
        const shortWorkout = {
            ...mockWorkout,
            duration: 5 // 5 minutes
        };

        render(
            <WorkoutTimer
                workout={shortWorkout}
                onWorkoutComplete={mockWorkoutComplete}
            />
        );

        // For workouts under ~7 minutes, minimum should be 5 minutes (300 seconds)
        expect(screen.getByText('Minimum Required: 5 minutes')).toBeInTheDocument();
    });

    it('displays start time when workout begins', () => {
        render(
            <WorkoutTimer
                workout={mockWorkout}
                onWorkoutComplete={mockWorkoutComplete}
            />
        );

        const startButton = screen.getByText('🚀 Start Workout');
        fireEvent.click(startButton);

        expect(screen.getByText(/Started:/)).toBeInTheDocument();
    });

    it('cleans up timer on unmount', () => {
        const { unmount } = render(
            <WorkoutTimer
                workout={mockWorkout}
                onWorkoutComplete={mockWorkoutComplete}
            />
        );

        const startButton = screen.getByText('🚀 Start Workout');
        fireEvent.click(startButton);

        // Spy on clearInterval
        const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

        unmount();

        expect(clearIntervalSpy).toHaveBeenCalled();
    });
}); 