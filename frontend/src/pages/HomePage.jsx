import{Show, SignInButton, SignUpButton, UserButton, SignOutButton} from "@clerk/react"


function HomePage() {
  return (
    <>
    <div>HomePage</div>
     <button className="btn btn-primary">CLICK</button>
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
      <Toaster/>
    </>
  )
}

export default HomePage