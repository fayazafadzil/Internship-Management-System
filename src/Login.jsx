import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

const EyeIcon = ({ open }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
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

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Required";
    if (!form.password) newErrors.password = "Required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    alert("Logged in successfully!");
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "8px 12px",
    border: `1px solid ${errors[field] ? "#e53e3e" : "#cbd5e1"}`,
    borderRadius: "5px",
    fontSize: "13px",
    color: "#334155",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Segoe UI', sans-serif",
    background: "#fff",
    transition: "all 0.2s",
  });

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "4px",
    fontFamily: "'Segoe UI', sans-serif",
    textAlign: "left",
  };

  return (
    <>
      <style>{`
        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          height: 100vh !important;
          background: #9FC9D9; 
          overflow: hidden !important; 
        }

        *, *::before, *::after { 
          box-sizing: border-box; 
          margin: 0; 
          padding: 0; 
        }

        #root {
          display: flex;
          flex-direction: column;
        }

        .signin-input:focus {
          border-color: #0f172a !important;
          box-shadow: 0 0 0 2px rgba(15,23,42,0.1);
        }

        .login-btn-style:hover {
          background: #0f1c3f !important;
        }

        .action-link {
          color: #000;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          font-size: 11px;
        }
        .action-link:hover { text-decoration: underline; }

        .eye-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          padding: 0;
          display: flex;
          align-items: center;
        }
        .eye-btn:hover { color: #64748b; }

        @media (max-width: 480px) {
          .card {
            padding: 24px 20px !important;
            margin: 15px !important;
          }
          .footer-inner {
            flex-direction: column !important;
            align-items: center !important;
            gap: 5px !important;
            padding: 8px 15px !important;
          }
        }
      `}</style>

      <div style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "'Segoe UI', sans-serif",
      }}>

        <div style={{
          flex: "1 1 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
        }}>
          
          <div className="card" style={{
            width: "100%",
            maxWidth: "440px", 
            background: "#eef4f8",
            padding: "32px 36px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}>

            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px", color: "#000" }}>
                Sign in to your account
              </h2>
              <p style={{ color: "#64748b", fontSize: "11px" }}>
                sign in using your university email and password
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              
              <div style={{ marginBottom: "12px" }}>
                <label style={labelStyle}>University Email</label>
                <input
                  className="signin-input"
                  name="email"
                  type="email"
                  placeholder="e.g. cs12845@csc.ruh.ac.lk"
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyle("email")}
                  autoComplete="email"
                />
                {errors.email && <p style={{ color: "#e53e3e", fontSize: "9px", marginTop: "1px", textAlign: "left" }}>{errors.email}</p>}
              </div>

              <div style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                  <span onClick={() => alert("Forgot Password functionality coming soon!")} className="action-link" style={{ color: "#64748b", fontWeight: "500" }}>Forgot Password?</span>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    className="signin-input"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    style={{ ...inputStyle("password"), paddingRight: "32px" }}
                    autoComplete="current-password"
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {errors.password && <p style={{ color: "#e53e3e", fontSize: "9px", marginTop: "1px", textAlign: "left" }}>{errors.password}</p>}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px", textAlign: "left" }}>
                <input
                  type="checkbox"
                  id="staySignedIn"
                  checked={staySignedIn}
                  onChange={(e) => setStaySignedIn(e.target.checked)}
                  style={{ cursor: "pointer", width: "13px", height: "13px" }}
                />
                <label htmlFor="staySignedIn" style={{ fontSize: "11px", color: "#64748b", cursor: "pointer", userSelect: "none" }}>
                  Stay signed in on this browser
                </label>
              </div>

              <button
                type="submit"
                className="login-btn-style"
                style={{
                  width: "100%",
                  maxWidth: "140px",
                  padding: "8px 0",
                  background: "#111e47", 
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "'Segoe UI', sans-serif",
                  transition: "background 0.2s",
                  display: "block",
                  margin: "0 auto 16px auto"
                }}
              >
                Login
              </button>

              <p style={{ fontSize: "11.5px", color: "#64748b" }}>
                Don't have an account? <span onClick={() => navigate("/signup")} className="action-link" style={{ fontWeight: "700" }}>Sign Up</span>
              </p>

            </form>
          </div>
        </div>

        <footer style={{ 
          background: "#1B4472", 
          width: "100%", 
          flexShrink: 0
        }}>
          <div className="footer-inner" style={{
            color: "rgba(255,255,255,0.6)",
            padding: "10px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
            fontSize: "10.5px",
            width: "100%",
            boxSizing: "border-box"
          }}>
            <div>
              &copy; {new Date().getFullYear()} IMS Portal. All rights reserved by the Department of Computer Science.
            </div>
            <div className="footer-links" style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              {["Privacy Policy", "Terms of Services", "Contact Support", "University Guidelines"].map(l => (
                <span onClick={() => alert(`${l} coming soon!`)} key={l} style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", cursor: "pointer" }}>{l}</span>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}