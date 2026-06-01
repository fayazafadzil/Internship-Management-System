import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🚀 Imported useNavigate

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

export default function SignUp() {
  const navigate = useNavigate(); // 🚀 Initialized navigate hook
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.studentId.trim()) newErrors.studentId = "Student ID is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Minimum 6 characters";
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    alert("Account created successfully!");
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "7px 12px",
    border: `1px solid ${errors[field] ? "#e53e3e" : "#cbd5e1"}`,
    borderRadius: "6px",
    fontSize: "13px",
    color: "#334155",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
    background: "#fff",
    transition: "all 0.2s",
  });

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    color: "#000000",
    marginBottom: "2px",
    fontFamily: "'Inter', sans-serif",
    textAlign: "left",
  };

  return (
    <>
      <style>{`
        html, body, #root { 
          margin: 0 !important; 
          padding: 0 !important; 
          width: 100% !important; 
          height: 100% !important;
          overflow: hidden !important; 
          background: #92b4c2 !important;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .signup-input:focus { border-color: #071947 !important; }
        .signup-btn:hover { background: #0f1c3f !important; }
        .login-link { color: #000; font-weight: 700; cursor: pointer; text-decoration: none; }
        .login-link:hover { text-decoration: underline; }
        .eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8; padding: 0; display: flex; align-items: center; }
      `}</style>

      <div style={{
        width: "100vw",
        height: "100vh",
        background: "#92b4c2", 
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden"
      }}>
        
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5px 15px",
        }}>
          
          <div style={{
            width: "100%",
            maxWidth: "480px", 
            background: "#cee0e8", 
            padding: "16px 28px", 
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            textAlign: "center"
          }}>
            
            <div style={{ marginBottom: "10px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "2px", color: "#000" }}>
                Create your student account
              </h2>
              <p style={{ color: "#475569", fontSize: "11px", lineHeight: "1.3" }}>
                Create your student account to access the Internship Management System
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              
              <div style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>First Name</label>
                  <input className="signup-input" name="firstName" placeholder="Enter first name" value={form.firstName} onChange={handleChange} style={inputStyle("firstName")} />
                  {errors.firstName && <p style={{ color: "#e53e3e", fontSize: "10px", marginTop: "1px", textAlign: "left" }}>{errors.firstName}</p>}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Last Name</label>
                  <input className="signup-input" name="lastName" placeholder="Enter last name" value={form.lastName} onChange={handleChange} style={inputStyle("lastName")} />
                  {errors.lastName && <p style={{ color: "#e53e3e", fontSize: "10px", marginTop: "1px", textAlign: "left" }}>{errors.lastName}</p>}
                </div>
              </div>

              <div style={{ marginBottom: "6px" }}>
                <label style={labelStyle}>Student ID</label>
                <input className="signup-input" name="studentId" placeholder="e.g. SC/2022/12845" value={form.studentId} onChange={handleChange} style={inputStyle("studentId")} />
                {errors.studentId && <p style={{ color: "#e53e3e", fontSize: "10px", marginTop: "1px", textAlign: "left" }}>{errors.studentId}</p>}
              </div>

              <div style={{ marginBottom: "6px" }}>
                <label style={labelStyle}>University Email</label>
                <input className="signup-input" name="email" type="email" placeholder="e.g. Student@university.ruh.ac.lk" value={form.email} onChange={handleChange} style={inputStyle("email")} />
                {errors.email && <p style={{ color: "#e53e3e", fontSize: "10px", marginTop: "1px", textAlign: "left" }}>{errors.email}</p>}
              </div>

              <div style={{ marginBottom: "6px" }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <input className="signup-input" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} style={{ ...inputStyle("password"), paddingRight: "38px" }} />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {errors.password && <p style={{ color: "#e53e3e", fontSize: "10px", marginTop: "1px", textAlign: "left" }}>{errors.password}</p>}
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input className="signup-input" name="confirmPassword" type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={handleChange} style={{ ...inputStyle("confirmPassword"), paddingRight: "38px" }} />
                  <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
                {errors.confirmPassword && <p style={{ color: "#e53e3e", fontSize: "10px", marginTop: "1px", textAlign: "left" }}>{errors.confirmPassword}</p>}
              </div>

              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <button type="submit" className="signup-btn" style={{ width: "100%", maxWidth: "140px", padding: "8px", background: "#111e47", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter', sans-serif", transition: "background 0.2s" }}>
                  Sign Up
                </button>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.12)", marginBottom: "8px" }} />

              <p style={{ fontSize: "12px", color: "#475569" }}>
                Already have an account?{" "}
                {/* 🚀 Changed to a span triggering programmatic navigate */}
                <span onClick={() => navigate("/login")} className="login-link">
                  Login
                </span>
              </p>
            </form>
          </div>
        </div>

        <footer style={{
          background: "#071947", 
          color: "rgba(255,255,255,0.6)",
          padding: "18px 40px", 
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "12px", 
          width: "100%",
          zIndex: 10
        }}>
          <div>
            &copy; 2026 IMS Portal. All rights reserved by the Department of Computer Science.
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy Policy", "Terms of Services", "Contact Support", "University Guidelines"].map(l => (
              <a href="#" key={l} style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}