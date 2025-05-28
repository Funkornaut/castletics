import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { workouts } from "./workouts";

function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

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
      <WorkoutList />
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

function WorkoutList() {
  const workout = getWorkoutOfTheDay();
  return (
    <div
      style={{
        background: 'var(--castletics-off-white)',
        color: 'var(--castletics-navy)',
        borderRadius: '1rem',
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
        padding: '2rem',
        maxWidth: '400px',
        margin: '2rem auto',
      }}
    >
      <h2 style={{ color: 'var(--castletics-purple)', marginBottom: '0.5rem' }}>Workout of the Day</h2>
      <h3 style={{ color: 'var(--castletics-teal)', marginTop: 0 }}>{workout.name}</h3>
      <p><strong>Category:</strong> {workout.category}</p>
      <p><strong>Duration:</strong> {workout.duration} minutes</p>
      <h4 style={{ color: 'var(--castletics-greenish-teal)', marginTop: '1.5rem' }}>Exercises:</h4>
      <ul style={{ paddingLeft: '1.2rem' }}>
        {workout.exercises.map((exercise: string, idx: number) => (
          <li key={idx} style={{ marginBottom: '0.5rem' }}>{exercise}</li>
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
