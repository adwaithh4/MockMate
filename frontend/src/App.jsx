import { Show, SignInButton, SignUpButton, UserButton, SignOutButton } from "@clerk/react";

function App() {
  return (
    <>
      <h1>HELLO</h1>

      <Show when="signed-out">
        <SignInButton mode="modal" >
          <button className="">Login</button>
        </SignInButton>
        <SignUpButton />
      </Show>

      <Show when="signed-in">
        <UserButton />
        <SignOutButton />
      </Show>
    </>
  );
}

export default App;