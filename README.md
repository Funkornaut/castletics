# Castletics

A Farcaster fitness tracking mini-app that helps users maintain workout streaks and connect with a fitness community.

## Overview

Castletics is built with Vite and React, featuring Farcaster authentication and Supabase for data persistence. Users can:

- Connect via Farcaster Auth Kit
- Log workouts and track streaks  
- View leaderboards and community activity
- Maintain persistent fitness data

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Authentication**: Farcaster Auth Kit
- **Database**: Supabase (PostgreSQL)
- **Styling**: CSS (custom)
- **Testing**: Vitest + React Testing Library

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase database:**
   - Follow the detailed guide in [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)
   - Create your `.env.local` file with Supabase credentials

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

## Database Schema

The app uses three main tables:

- **users**: Farcaster user profiles and metadata
- **streaks**: Workout streak tracking per user  
- **workouts**: Individual workout logs with details

See [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) for complete schema details.

## Project Structure

```
src/
├── components/         # React components
├── hooks/             # Custom React hooks for data fetching
├── lib/               # Database client and configuration
├── services/          # Database service layer
└── test/              # Test setup and utilities

supabase/
└── migrations/        # Database schema and migrations
```

## Key Features

### Database Services

- **UserService**: User creation, updates, and profile management
- **StreakService**: Streak calculation, leaderboards, and status tracking  
- **WorkoutService**: Workout logging, history, and statistics

### React Hooks

- **useUser**: User data and authentication state
- **useStreak**: Streak tracking and updates
- **useWorkouts**: Workout logging and history
- **useWorkoutStats**: Statistics and analytics

### Authentication

Integrated with Farcaster Auth Kit for seamless web3 authentication without wallet requirements.

## Frame Configuration

The `/.well-known/farcaster.json` is served from the [public directory](https://vite.dev/guide/assets) and can be updated by editing `./public/.well-known/farcaster.json`.

You can also use the `public` directory to serve a static image for `splashBackgroundImageUrl`.

### Frame Embed

Add the `fc:frame` in `index.html` to make your root app URL sharable in feeds:

```html
<head>
  <!--- other tags --->
  <meta name="fc:frame" content='{"version":"next","imageUrl":"https://placehold.co/900x600.png?text=Frame%20Image","button":{"title":"Open","action":{"type":"launch_frame","name":"App Name","url":"https://app.com"}}}' /> 
</head>
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate coverage report
- `npm run lint` - Run linter

### Environment Variables

Required in `.env.local`:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Testing the Database Integration

Import and use the `SupabaseExample` component to test database operations:

```tsx
import { SupabaseExample } from './components/SupabaseExample';

// Add to your app for testing
<SupabaseExample />
```

## Deployment

This project is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Next Steps

1. **Authentication Integration**: Connect Farcaster Auth Kit with Supabase users
2. **UI Implementation**: Build components using the database hooks
3. **Real-time Features**: Add Supabase subscriptions for live updates  
4. **Frame Actions**: Implement Farcaster Frame actions for in-feed interactions
5. **Social Features**: Add following, challenges, and community features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
