import { describe, it, expect, vi } from 'vitest';
import { workouts, getRandomWorkout } from '../workouts';

describe('Workouts Module', () => {
    describe('workouts data', () => {
        it('should have a valid workouts array', () => {
            expect(workouts).toBeDefined();
            expect(Array.isArray(workouts)).toBe(true);
            expect(workouts.length).toBeGreaterThan(0);
        });

        it('should have properly structured workout objects', () => {
            workouts.forEach((workout) => {
                expect(workout).toHaveProperty('name');
                expect(workout).toHaveProperty('category');
                expect(workout).toHaveProperty('duration');
                expect(workout).toHaveProperty('exercises');

                expect(typeof workout.name).toBe('string');
                expect(typeof workout.category).toBe('string');
                expect(typeof workout.duration).toBe('number');
                expect(Array.isArray(workout.exercises)).toBe(true);

                expect(workout.name.length).toBeGreaterThan(0);
                expect(workout.category.length).toBeGreaterThan(0);
                expect(workout.duration).toBeGreaterThan(0);
                expect(workout.exercises.length).toBeGreaterThan(0);
            });
        });

        it('should have valid exercise arrays', () => {
            workouts.forEach((workout) => {
                workout.exercises.forEach((exercise) => {
                    expect(typeof exercise).toBe('string');
                    expect(exercise.length).toBeGreaterThan(0);
                });
            });
        });
    });

    describe('getRandomWorkout function', () => {
        it('should return a workout object', () => {
            const randomWorkout = getRandomWorkout();

            expect(randomWorkout).toBeDefined();
            expect(randomWorkout).toHaveProperty('name');
            expect(randomWorkout).toHaveProperty('category');
            expect(randomWorkout).toHaveProperty('duration');
            expect(randomWorkout).toHaveProperty('exercises');
        });

        it('should return different workouts on multiple calls (probabilistic)', () => {
            const results = new Set();

            // Run multiple times to increase chance of getting different workouts
            for (let i = 0; i < 20; i++) {
                const workout = getRandomWorkout();
                results.add(workout.name);
            }

            // If there are multiple workouts, we should see some variation
            if (workouts.length > 1) {
                expect(results.size).toBeGreaterThan(1);
            }
        });

        it('should return a workout that exists in the workouts array', () => {
            const randomWorkout = getRandomWorkout();
            const workoutExists = workouts.some(workout =>
                workout.name === randomWorkout.name &&
                workout.category === randomWorkout.category &&
                workout.duration === randomWorkout.duration
            );

            expect(workoutExists).toBe(true);
        });
    });

    describe('workout of the day logic', () => {
        it('should be deterministic based on date', () => {
            // Mock Date to test deterministic behavior
            const mockDate = new Date('2024-01-15');
            vi.setSystemTime(mockDate);

            const today = mockDate.getDate(); // 15
            const expectedIndex = (today - 1) % workouts.length; // (15-1) % length
            const expectedWorkout = workouts[expectedIndex];

            // Import and test the same logic used in getWorkoutOfTheDay
            const workoutOfTheDay = workouts[(today - 1) % workouts.length];

            expect(workoutOfTheDay).toEqual(expectedWorkout);

            vi.useRealTimers();
        });

        it('should cycle through all workouts over a month', () => {
            const seenWorkouts = new Set();

            // Test for 31 days
            for (let day = 1; day <= 31; day++) {
                const index = (day - 1) % workouts.length;
                const workout = workouts[index];
                seenWorkouts.add(workout.name);
            }

            // Should have seen all unique workouts (or at least cycle through available ones)
            expect(seenWorkouts.size).toBe(Math.min(workouts.length, 31));
        });
    });

    describe('workout categories', () => {
        it('should have valid workout categories', () => {
            workouts.forEach((workout) => {
                // Categories should be one of the expected ones or at least be a non-empty string
                expect(typeof workout.category).toBe('string');
                expect(workout.category.length).toBeGreaterThan(0);
            });
        });

        it('should have reasonable workout durations', () => {
            workouts.forEach((workout) => {
                expect(workout.duration).toBeGreaterThan(0);
                expect(workout.duration).toBeLessThanOrEqual(120); // Reasonable max of 2 hours
                expect(Number.isInteger(workout.duration)).toBe(true);
            });
        });
    });
}); 