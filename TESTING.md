# Castletics Testing Guide

This guide provides comprehensive testing instructions for the Castletics application, including unit tests, integration tests, and manual testing procedures.

## 🧪 Testing Stack

We use a modern TypeScript testing stack:

- **Vitest**: Fast unit test runner with TypeScript support
- **React Testing Library**: Component testing utilities
- **jsdom**: Browser environment simulation
- **MSW**: API mocking for integration tests
- **Coverage**: Built-in code coverage reporting

## 📋 Quick Start

### Install Testing Dependencies

```bash
npm install
```

### Run Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with UI (interactive browser interface)
npm run test:ui
```

## 🔍 Test Structure

### Test Files Location
```
src/
├── test/
│   ├── setup.ts          # Global test configuration
│   ├── App.test.tsx      # Main app component tests
│   ├── api.test.ts       # API integration tests
│   └── workouts.test.ts  # Workout logic tests
```

### Test Categories

#### 1. Unit Tests (`*.test.tsx`, `*.test.ts`)
- Test individual components and functions
- Mock external dependencies
- Fast execution
- High coverage

#### 2. Integration Tests
- Test API interactions
- Test component integration
- Mock external services

#### 3. Manual Testing
- Real Farcaster integration
- End-to-end workflows
- Browser compatibility

## 🧩 Test Coverage

### Current Test Coverage

The test suite covers:

✅ **App Component**
- Farcaster context initialization
- Dynamic FID fetching vs fallback
- Streak management
- Workout switching (daily vs random)
- Error handling

✅ **API Integration**
- Streak fetching with different FIDs
- Workout completion
- Authentication flows
- Error scenarios

✅ **Workout Logic**
- Workout data validation
- Random workout selection
- Daily workout determinism
- Data structure integrity

### Running Coverage Reports

```bash
npm run test:coverage
```

This generates:
- Terminal coverage summary
- HTML report in `coverage/` directory
- JSON report for CI/CD integration

## 🔧 Testing the Farcaster Integration

### Unit Tests (Automated)

The unit tests mock the Farcaster SDK to test different scenarios:

```typescript
// Test with valid user context
const mockContext = {
  user: { fid: 12345, username: 'testuser' },
  client: { clientFid: 9152, added: false }
};

// Test fallback when no user context
const mockContextNoUser = {
  user: null,
  client: { clientFid: 9152, added: false }
};
```

### Manual Testing (Real Integration)

#### Prerequisites
1. Deploy your app to a public URL (Vercel, Netlify, etc.)
2. Update `farcaster.json` with your domain
3. Ensure HTTPS is enabled

#### Test Steps

1. **Deploy and Configure**
```bash
npm run build
# Deploy to your hosting platform
# Update public/.well-known/farcaster.json with your domain
```

2. **Test in Farcaster Client**
- Open Warpcast or other Farcaster client
- Share your app URL in a cast
- Click the frame embed
- Verify your FID appears (not the fallback 18144)

3. **Test Streak Functionality**
- Complete a workout
- Verify streak increments
- Test with different Farcaster accounts
- Verify each user has separate streaks

## 🎯 Test Scenarios

### Core Functionality Tests

#### Scenario 1: New User Flow
```bash
# Test Steps:
1. User opens app for first time in Farcaster
2. App fetches their FID from context
3. API returns { streak: 0, lastWorkout: null }
4. User completes workout
5. Streak updates to 1
```

#### Scenario 2: Returning User
```bash
# Test Steps:
1. Returning user opens app
2. App fetches existing streak data
3. Displays current streak
4. User can continue or reset streak
```

#### Scenario 3: Error Handling
```bash
# Test Steps:
1. Network failure during API calls
2. Invalid Farcaster context
3. Malformed API responses
4. App should gracefully degrade
```

### Performance Tests

```bash
# Check bundle size
npm run build
npx bundlesize

# Check load times
npm run preview
# Use browser dev tools to measure
```

## 🛠️ Writing New Tests

### Component Test Template

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TestWrapper } from './setup';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    render(
      <TestWrapper>
        <YourComponent />
      </TestWrapper>
    );

    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    render(
      <TestWrapper>
        <YourComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Updated Text')).toBeInTheDocument();
    });
  });
});
```

### API Test Template

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle successful API call', async () => {
    const mockResponse = { data: 'test' };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await yourApiFunction();
    expect(result).toEqual(mockResponse);
  });
});
```

## 🐛 Debugging Tests

### Common Issues

1. **Async Tests Failing**
```typescript
// ❌ Don't forget to await
it('should update data', () => {
  fireEvent.click(button);
  expect(screen.getByText('Updated')).toBeInTheDocument(); // May fail
});

// ✅ Use waitFor for async updates
it('should update data', async () => {
  fireEvent.click(button);
  await waitFor(() => {
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });
});
```

2. **Mock Issues**
```typescript
// ❌ Mocks not reset between tests
describe('Tests', () => {
  it('test 1', () => { /* mock setup */ });
  it('test 2', () => { /* previous mock still active */ });
});

// ✅ Clear mocks in beforeEach
beforeEach(() => {
  vi.clearAllMocks();
});
```

3. **Console Errors**
- Check for missing test dependencies
- Verify mock configurations
- Ensure proper cleanup

### Debug Mode

```bash
# Run specific test file
npm run test App.test.tsx

# Run with verbose output
npm run test -- --reporter=verbose

# Debug in browser
npm run test:ui
```

## 📊 Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

## 🎯 Testing Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what users see and do
   - Avoid testing internal state directly

2. **Use Meaningful Test Names**
   ```typescript
   // ❌ Unclear
   it('should work', () => {});
   
   // ✅ Descriptive
   it('should display user streak when logged in', () => {});
   ```

3. **Arrange, Act, Assert Pattern**
   ```typescript
   it('should update streak on workout completion', async () => {
     // Arrange
     const mockUser = { fid: 123, streak: 5 };
     setupMocks(mockUser);
     
     // Act
     fireEvent.click(screen.getByText('Complete Workout'));
     
     // Assert
     await waitFor(() => {
       expect(screen.getByText('Current Streak: 6')).toBeInTheDocument();
     });
   });
   ```

4. **Test Error Scenarios**
   - Network failures
   - Invalid data
   - Edge cases

5. **Keep Tests Fast**
   - Mock external dependencies
   - Avoid unnecessary async operations
   - Use efficient selectors

## 🚀 Next Steps

1. **Install dependencies**: `npm install`
2. **Run tests**: `npm run test:watch`
3. **Check coverage**: `npm run test:coverage`
4. **Deploy and test**: Test real Farcaster integration
5. **Add more tests**: Expand coverage as you add features

Happy testing! 🧪✨ 