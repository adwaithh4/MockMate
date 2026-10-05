import { Show, SignInButton, SignUpButton, UserButton, SignOutButton, useUser } from "@clerk/react";
import { Navigate, Route, Routes } from "react-router";

function App() {
  const {isSignedIn} = useUser();

  return (
    <>
      <h1 className="text-red-500 bg-orange-400 p-10 text-3xl">Welcome to the app</h1>

      <Routes>
         <Route path="/" element={<HomePage/>}/>
         <Route path="/about" element={isSignedIn ? <ProblemsPage/> : <Navigate to={"/"}/> } />
      </Routes>  

    </>
  );
}

export default App;