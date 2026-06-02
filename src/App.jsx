import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import SignUp from "./signup"; 
import SignIn from "./Login"; 
import Forgot from "./Forgot"; 
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} /> 
        <Route path="/forgot" element={<Forgot />} /> 
      </Routes>
    </Router>
  );
}