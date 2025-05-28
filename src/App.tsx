import { sdk } from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { workouts, getRandomWorkout } from "./workouts";

function App() {
  const [randomWorkout, setRandomWorkout] = useState<null | typeof workouts[0]>(null);

  useEffect(() => {
    sdk.actions.ready();
  }, []);

  const handleRandomWorkout = () => {
    setRandomWorkout(getRandomWorkout());
  };

  const handleShowWorkoutOfTheDay = () => {
    setRandomWorkout(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--castletics-navy)',
        color: 'var(--castletics-off-white)',
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '2rem 1rem',
      }}
    >
      <h1 style={{ color: 'var(--castletics-teal)', letterSpacing: '2px', marginBottom: '1.5rem' }}>Castletics</h1>
      <ConnectMenu />
      <div style={{ margin: '1rem 0' }}>
        <button type="button" onClick={handleRandomWorkout} style={{ marginRight: '0.5rem' }}>
          Random Workout
        </button>
        {randomWorkout && (
          <button type="button" onClick={handleShowWorkoutOfTheDay}>
            Show Workout of the Day
          </button>
        )}
      </div>
      <WorkoutDisplay workout={randomWorkout || getWorkoutOfTheDay()} isRandom={!!randomWorkout} />
    </div>
  );
}

function ConnectMenu() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  if (isConnected) {
    return (
      <>
        <div>Connected account:</div>
        <div>{address}</div>
        <SignButton />
      </>
    );
  }

  return (
    <button type="button" onClick={() => connect({ connector: connectors[0] })}>
      Connect
    </button>
  );
}

function SignButton() {
  const { signMessage, isPending, data, error } = useSignMessage();

  return (
    <>
      <button type="button" onClick={() => signMessage({ message: "hello world" })} disabled={isPending}>
        {isPending ? "Signing..." : "Sign message"}
      </button>
      {data && (
        <>
          <div>Signature</div>
          <div>{data}</div>
        </>
      )}
      {error && (
        <>
          <div>Error</div>
          <div>{error.message}</div>
        </>
      )}
    </>
  );
}

function WorkoutDisplay({ workout, isRandom }: { workout: typeof workouts[0], isRandom: boolean }) {
  return (
    <div
      style={{
        background: 'var(--castletics-off-white)',
        color: 'var(--castletics-navy)',
        borderRadius: '1rem',
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
        padding: '2rem',
        width: '360px',
        minHeight: '340px',
        margin: '2rem auto',
        wordBreak: 'break-word',
      }}
    >
      <h2 style={{ color: 'var(--castletics-purple)', marginBottom: '0.5rem' }}>
        {isRandom ? 'Random Workout' : 'Workout of the Day'}
      </h2>
      <h3 style={{ color: 'var(--castletics-teal)', marginTop: 0 }}>{workout.name}</h3>
      <p><strong>Category:</strong> {workout.category}</p>
      <p><strong>Duration:</strong> {workout.duration} minutes</p>
      <h4 style={{ color: 'var(--castletics-greenish-teal)', marginTop: '1.5rem' }}>Exercises:</h4>
      <ul style={{ paddingLeft: '1.2rem' }}>
        {workout.exercises.map((exercise: string, idx: number) => (
          <li key={idx} style={{ marginBottom: '0.5rem', wordBreak: 'break-word' }}>{exercise}</li>
        ))}
      </ul>
    </div>
  );
}

function getWorkoutOfTheDay() {
  const today = new Date().getDate(); // 1-31
  const index = (today - 1) % workouts.length;
  return workouts[index];
}

export default App;
