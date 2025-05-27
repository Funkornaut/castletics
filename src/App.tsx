import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { workouts } from "./workouts";

function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <>
      <div>Mini App + Vite + TS + React + Wagmi</div>
      <ConnectMenu />
      <WorkoutList />
    </>
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
    <div>
      <h2>Workout of the Day</h2>
      <h3>{workout.name}</h3>
      <p><strong>Category:</strong> {workout.category}</p>
      <p><strong>Duration:</strong> {workout.duration} minutes</p>
      <h4>Exercises:</h4>
      <ul>
        {workout.exercises.map((exercise: string, idx: number) => (
          <li key={idx}>{exercise}</li>
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
