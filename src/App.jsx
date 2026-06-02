<<<<<<< HEAD
import IMSInternshipTracker from "./Internshipstatus";

export default function App() {
  return <IMSInternshipTracker />;
}
=======
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
>>>>>>> 8fb16fabf7b6d7f3147e3106a54947b9f756f499
