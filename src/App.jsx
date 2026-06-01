import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import SignUp from "./signup"; 
import SignIn from "./Login"; // 👈 මෙන්න මෙතනින් Login.jsx එක සම්බන්ධ කළා

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} /> {/* 👈 ප්ලේස්හෝල්ඩර් එක වෙනුවට SignIn එක දැම්මා */}
      </Routes>
    </Router>
  );
}