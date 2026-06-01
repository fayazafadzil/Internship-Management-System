import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email");
      return;
    }
    alert("Reset link sent successfully!");
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    border: `1px solid ${error ? "#e53e3e" : "#cbd5e1"}`,
    borderRadius: "6px",
    fontSize: "13px",
    color: "#334155",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
    background: "#fff",
    transition: "all 0.2s",
  };

  return (
    <>
      <style>{`
        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100vh !important;
          background: #92b4c2 !important; 
          overflow: hidden !important; 
        }

        * { 
          box-sizing: border-box; 
          margin: 0; 
          padding: 0; 
        }

        .forgot-input:focus {
          border-color: #111e47 !important;
        }

        .reset-btn-style:hover {
          background: #0f1c3f !important;
        }

        .action-link {
          color: #000;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          font-size: 11px;
          font-family: "'Inter', sans-serif";
        }
        .action-link:hover { text-decoration: underline; }
      `}</style>

      <div style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
        position: "relative"
      }}>

        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 20px",
        }}>
          
          <div style={{ width: "100%", maxWidth: "440px" }}>
            
            <div style={{
              background: "#cee0e8", 
              padding: "30px 35px",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              textAlign: "center",
              marginBottom: "16px" 
            }}>

              <div style={{ marginBottom: "22px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "6px", color: "#000" }}>
                  Forgot your Password?
                </h2>
                <p style={{ color: "#475569", fontSize: "11px", lineHeight: "1.4" }}>
                  Enter your university email to recover your account
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                
                <div style={{ marginBottom: "16px" }}>
                  <label style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#000000",
                    marginBottom: "5px",
                    textAlign: "left"
                  }}>University Email</label>
                  <input
                    className="forgot-input"
                    type="email"
                    placeholder="e.g. Student@university.ruh.ac.lk"
                    value={email}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                  {error && <p style={{ color: "#e53e3e", fontSize: "10px", marginTop: "2px", textAlign: "left" }}>{error}</p>}
                </div>

                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <button
                    type="submit"
                    className="reset-btn-style"
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "#111e47", 
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                      transition: "background 0.2s"
                    }}
                  >
                    Send Reset Link
                  </button>
                </div>

                {/* ── 修正 කලා: දැන් මේක ක්ලික් කරාම කෙලින්ම "/login" එකට යනවා ── */}
                <p style={{ fontSize: "12px" }}>
                  <span onClick={() => navigate("/login")} className="action-link">&larr; Back to Login</span>
                </p>

              </form>
            </div>

            <div style={{
              background: "#cee0e8", 
              padding: "15px 25px",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
              textAlign: "left"
            }}>
              <h4 style={{ fontSize: "11.5px", fontWeight: "700", color: "#000", marginBottom: "3px" }}>
                Need assistance?
              </h4>
              <p style={{ color: "#475569", fontSize: "10.5px", lineHeight: "1.4" }}>
                If you no longer have access to your university email, please contact our support center for identity verification.
              </p>
            </div>

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
          flexShrink: 0,
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