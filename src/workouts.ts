type Workout = {
    name: string;
    category: 'upper' | 'lower' | 'core' | 'full';
    duration: number; // in minutes
    exercises: string[];
  };
  
  export const workouts: Workout[] = [
    // Upper Body Workouts
    {
      name: "Push-Up Pyramid",
      category: "upper",
      duration: 30,
      exercises: [
        "Push-ups (10 sets descending from 10 reps)",
        "Arm Circles (2 minutes forward/backward)",
        "Triceps Dips on floor (3 sets of 12)",
        "Plank Shoulder Taps (3 sets of 20 taps)"
      ]
    },
    {
      name: "Arm Burner",
      category: "upper",
      duration: 30,
      exercises: [
        "Wall Push-ups (3 sets of 15)",
        "Diamond Push-ups (3 sets of 10)",
        "Arm Pulses (2 minutes)",
        "Pike Push-ups (3 sets of 12)"
      ]
    },
    {
      name: "Plank Push & Pull",
      category: "upper",
      duration: 30,
      exercises: [
        "Plank to Push-up (3 sets of 15 reps)",
        "Wall Walks (3 rounds)",
        "Wide Arm Push-ups (3 sets of 12)",
        "Up-Down Planks (3 sets of 10 reps)"
      ]
    },
    {
      name: "Shoulder Sculptor",
      category: "upper",
      duration: 30,
      exercises: [
        "Arm Circles (3 minutes)",
        "Plank Arm Raises (3 sets of 10 each arm)",
        "Push-ups (3 sets of 15)",
        "Pike Hold (3 sets of 30s)"
      ]
    },
    {
      name: "Chest & Tris",
      category: "upper",
      duration: 30,
      exercises: [
        "Incline Push-ups (feet on ground, hands on elevated surface) (3x15)",
        "Diamond Push-ups (3x10)",
        "Dips on floor (3x12)",
        "Kneeling Push-ups Burnout (2 minutes continuous)"
      ]
    },
    {
      name: "Push-Pull Power",
      category: "upper",
      duration: 30,
      exercises: [
        "Dive Bomber Push-ups (3x10)",
        "Wall Pull Simulation (resisted back pulls x30)",
        "Superman Holds (3x30s)",
        "Arm Pulses (3x1 min)"
      ]
    },
    {
      name: "Upper Circuit",
      category: "upper",
      duration: 30,
      exercises: [
        "Push-ups (3x15)",
        "Wall Push-ups (3x20)",
        "Plank Shoulder Taps (3x20 taps)",
        "Pike Push-ups (3x10)"
      ]
    },
    {
      name: "Chest Crusher",
      category: "upper",
      duration: 30,
      exercises: [
        "Push-up Hold (3x30s)",
        "Wide Push-ups (3x15)",
        "Superman Extensions (3x12)",
        "Incline Push-ups (3x12)"
      ]
    },
    {
      name: "Arms & Core Combo",
      category: "upper",
      duration: 30,
      exercises: [
        "Plank Rows (3x10 per arm)",
        "Push-ups (3x15)",
        "Wall Angels (3x20 reps)",
        "High Plank Hold (3x1min)"
      ]
    },
    {
      name: "Bodyweight Strength Upper",
      category: "upper",
      duration: 30,
      exercises: [
        "Push-ups (5x10)",
        "Arm Circles & Pulses (2x2min)",
        "Plank Shoulder Taps (3x20)",
        "Pike Push-up Hold (3x20s)"
      ]
    },
  
    // Lower Body Workouts
    {
      name: "Leg Day Classic",
      category: "lower",
      duration: 30,
      exercises: [
        "Bodyweight Squats (4x20)",
        "Lunges (3x15 each leg)",
        "Wall Sit (3x45s)",
        "Calf Raises (3x25)"
      ]
    },
    {
      name: "Runner's Legs",
      category: "lower",
      duration: 30,
      exercises: [
        "High Knees (3x1min)",
        "Jump Squats (3x15)",
        "Step-Back Lunges (3x12 each leg)",
        "Standing Calf Raises (4x20)"
      ]
    },
    {
      name: "Legs & Cardio",
      category: "lower",
      duration: 30,
      exercises: [
        "Jog in Place (3x2min)",
        "Wall Sit (3x1min)",
        "Lunge Pulses (3x30s each leg)",
        "Jump Squats (3x12)"
      ]
    },
    {
      name: "Glute & Hamstring Focus",
      category: "lower",
      duration: 30,
      exercises: [
        "Glute Bridges (4x20)",
        "Donkey Kicks (3x15 each leg)",
        "Hamstring Curls (lying) (3x15)",
        "Single Leg Glute Bridge (3x10 each leg)"
      ]
    },
    {
      name: "Lateral Burner",
      category: "lower",
      duration: 30,
      exercises: [
        "Side Lunges (3x15 each side)",
        "Skater Jumps (3x30s)",
        "Wall Sit with Calf Raise (3x1min)",
        "Jumping Lunges (3x20 total)"
      ]
    },
    {
      name: "Quads & Calves",
      category: "lower",
      duration: 30,
      exercises: [
        "Narrow Squats (3x20)",
        "Wall Sit Hold (3x1min)",
        "Calf Raises (5x20)",
        "Step-Through Lunges (3x15 each)"
      ]
    },
    {
      name: "Hill Sprint Simulation",
      category: "lower",
      duration: 30,
      exercises: [
        "Sprint in Place (4x45s)",
        "Walking Lunges (3x20 steps)",
        "Stair Jumps (if stairs available, 3x15) or Jump Squats",
        "Wall Sit (3x1min)"
      ]
    },
    {
      name: "Balance Builder",
      category: "lower",
      duration: 30,
      exercises: [
        "Single Leg Squats (3x10 each)",
        "Side Leg Raises (3x15 each)",
        "Glute Bridge March (3x20 steps)",
        "Calf Raise Hold (3x30s)"
      ]
    },
    {
      name: "Explosive Lower",
      category: "lower",
      duration: 30,
      exercises: [
        "Jump Lunges (3x20)",
        "Broad Jumps (3x10)",
        "Skaters (3x1min)",
        "Wall Sit Burnout (2min hold)"
      ]
    },
    {
      name: "No Jump Leg Day",
      category: "lower",
      duration: 30,
      exercises: [
        "Bodyweight Squats (5x20)",
        "Glute Bridge (4x25)",
        "Standing Calf Raises (4x20)",
        "Step-Back Lunges (3x15 each leg)"
      ]
    },
  
    // Core Workouts
    {
      name: "Abs Attack",
      category: "core",
      duration: 30,
      exercises: [
        "Crunches (4x25)",
        "Leg Raises (3x20)",
        "Plank (3x1min)",
        "Flutter Kicks (3x30s)"
      ]
    },
    {
      name: "Plank Challenge",
      category: "core",
      duration: 30,
      exercises: [
        "High Plank (3x1min)",
        "Side Plank (3x30s each side)",
        "Up-Down Planks (3x15)",
        "Plank with Reach (3x10 each arm)"
      ]
    },
    {
      name: "Crunch Core",
      category: "core",
      duration: 30,
      exercises: [
        "Standard Crunch (4x30)",
        "Bicycle Crunch (3x30s)",
        "Reverse Crunch (3x20)",
        "Leg Raise Hold (3x30s)"
      ]
    },
    {
      name: "Oblique Sculpt",
      category: "core",
      duration: 30,
      exercises: [
        "Side Plank (3x45s each)",
        "Russian Twists (3x30 reps)",
        "Standing Side Crunch (3x20)",
        "Bicycle Crunch (3x20 each side)"
      ]
    },
    {
      name: "Core Cardio",
      category: "core",
      duration: 30,
      exercises: [
        "Mountain Climbers (3x1min)",
        "Plank Jacks (3x1min)",
        "High Knees (3x1min)",
        "Burpees (3x10)"
      ]
    },
    {
      name: "Lying Core Series",
      category: "core",
      duration: 30,
      exercises: [
        "Leg Raises (3x20)",
        "Flutter Kicks (3x30s)",
        "Toe Touches (3x20)",
        "Hollow Body Hold (3x30s)"
      ]
    },
    {
      name: "Standing Core",
      category: "core",
      duration: 30,
      exercises: [
        "Standing Oblique Crunches (3x20)",
        "High Knees (3x1min)",
        "Twist & Punch (3x1min)",
        "Balance Knee Tucks (3x15 each side)"
      ]
    },
    {
      name: "Dynamic Core",
      category: "core",
      duration: 30,
      exercises: [
        "Plank to Knee Tuck (3x20)",
        "V-Ups (3x15)",
        "Side Plank Reach Under (3x15 each side)",
        "Superman Hold (3x30s)"
      ]
    },
    {
      name: "Core Burn",
      category: "core",
      duration: 30,
      exercises: [
        "Crunches (4x30)",
        "Leg Raises (4x20)",
        "Side Planks (3x1min)",
        "Plank Hold (3x1min)"
      ]
    },
    {
      name: "Six Pack Starter",
      category: "core",
      duration: 30,
      exercises: [
        "Sit-Ups (3x25)",
        "Toe Touches (3x20)",
        "Flutter Kicks (3x30s)",
        "Plank (3x1min)"
      ]
    },
  
    // Full Body Workouts
    {
      name: "Body Burn",
      category: "full",
      duration: 30,
      exercises: [
        "Jumping Jacks (3x50)",
        "Push-ups (3x15)",
        "Squats (3x20)",
        "Mountain Climbers (3x30s)"
      ]
    },
    {
      name: "Cardio Crusher",
      category: "full",
      duration: 30,
      exercises: [
        "Jog in Place (3x3min)",
        "Burpees (3x15)",
        "High Knees (3x1min)",
        "Squat Jumps (3x15)"
      ]
    },
    {
      name: "HIIT Power",
      category: "full",
      duration: 30,
      exercises: [
        "30s On / 30s Off x 6 rounds:",
        " - Push-ups",
        " - Squats",
        " - Burpees",
        " - Plank Jacks"
      ]
    },
    {
      name: "Sweat Sesh",
      category: "full",
      duration: 30,
      exercises: [
        "Mountain Climbers (4x30s)",
        "Push-ups (3x15)",
        "Jumping Lunges (3x20)",
        "High Knees (3x1min)"
      ]
    },
    {
      name: "No Equipment Bootcamp",
      category: "full",
      duration: 30,
      exercises: [
        "Air Squats (4x25)",
        "Push-ups (3x15)",
        "Sit-ups (3x20)",
        "Burpees (3x10)"
      ]
    },
    {
      name: "Body Blast",
      category: "full",
      duration: 30,
      exercises: [
        "Jumping Jacks (3x1min)",
        "Push-ups (3x15)",
        "Mountain Climbers (3x30s)",
        "Squats (3x20)"
      ]
    },
    {
      name: "Core & Cardio Mix",
      category: "full",
      duration: 30,
      exercises: [
        "Plank (3x1min)",
        "High Knees (3x1min)",
        "Russian Twists (3x20)",
        "Jump Squats (3x15)"
      ]
    },
    {
      name: "Explosive Full Body",
      category: "full",
      duration: 30,
      exercises: [
        "Burpees (4x10)",
        "Push-ups (3x15)",
        "Skater Jumps (3x30s)",
        "Jumping Jacks (3x1min)"
      ]
    },
    {
      name: "Full Body Flow",
      category: "full",
      duration: 30,
      exercises: [
        "Yoga Sun Salutations (3x5min)",
        "Push-ups (3x10)",
        "Bodyweight Squats (3x20)",
        "Plank (3x1min)"
      ]
    },
    {
      name: "Endurance Circuit",
      category: "full",
      duration: 30,
      exercises: [
        "Jog in Place (3x2min)",
        "Air Squats (3x20)",
        "Push-ups (3x15)",
        "Mountain Climbers (3x30s)"
      ]
    }
  ];
  
  // Export functions to randomly pick a workout or filter by category
  export function getRandomWorkout(): Workout {
    return workouts[Math.floor(Math.random() * workouts.length)];
  }
  
  export function getWorkoutsByCategory(category: Workout['category']): Workout[] {
    return workouts.filter(workout => workout.category === category);
  }
  