import { useUser } from "@clerk/react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import {Toaster} from "react-hot-toast"


function App() {
  const {isSignedIn} = useUser();

  return (
    <>

      <Routes>
         <Route path="/" element={!isSignedIn ? <HomePage/> : <Navigate to={"/dashboard"}/>}/>
         {/* <Route path="/dashboard" element={isSignedIn ? <DashboardPage/> : <Navigate to={"/"}/>}/> */}
         <Route path="/problems" element={isSignedIn ? <ProblemsPage/> : <Navigate to={"/"}/> } />
         <Route path="/problem/:id" element={isSignedIn ? <ProblemPage/> : <Navigate to={"/"}/> } />
      </Routes>  
      <Toaster toastOptions={{duration: 3000}}/>

    </>
  );
}

export default App;