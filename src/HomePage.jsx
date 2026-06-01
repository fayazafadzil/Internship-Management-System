import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import officeImage from "./assets/home.png"; 
import logoImage from "./assets/uor-logo.png";  

const NAV_LINKS = ["Overview", "GPA Calculator", "Student CV", "Internship Status", "Record Book"];

const FEATURES = [
  {
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="#071947" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Automated Registration",
    desc: "Self-service onboarding for students with automated document verification and academic eligibility checks by the department.",
  },
  {
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "GPA-based Recommendations",
    desc: "Our intelligent algorithm matches students to elite opportunities based on academic performance and skill relevance.",
    isHighlighted: true,
  },
  {
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="#071947" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Digital Record Book",
    desc: "Real-time logging of internship activities with digital university review and tracking.",
  },
  {
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#071947" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Efficient Reporting",
    desc: "Generate comprehensive evaluation reports and internship completion certificates with a single-click.",
  },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', 'Segoe UI', sans-serif", color: "#fff", background: "#071947", minHeight: "100vh", width: "100%" }}>
      
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          background: #071947;
        }

        .container {
          width: 100%;
          padding: 0 48px;
        }

        .nav-links a { 
          color: #e2e8f0;                
          background-color: #11255e;    
          text-decoration: none; 
          font-family: 'Inter', 'Plus Jakarta Sans', sans-serif; 
          font-size: 15px;             
          font-weight: 700;             
          letter-spacing: 0.3px;        
          padding: 10px 18px;          
          border-radius: 8px;           
          transition: all 0.25s ease; 
          display: inline-flex;        
          align-items: center;
          white-space: nowrap;         
        }

        .nav-links a:hover { 
          background-color: #1a3680;    
          color: #ffffff;               
          transform: translateY(-1px);  
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .hero-wrapper { 
          width: 100%; 
          background: #183B62; 
          padding: 140px 0 60px 0; 
        }
        .hero-container { 
          display: flex; 
          flex-direction: row; 
          align-items: center; 
          justify-content: space-between; 
          gap: 40px; 
        }

        .hero-text-block {
          flex: 1.2;
          max-width: 600px;
          margin-top: 10px;
          text-align: left; 
        }

        .trusted-wrapper { 
          width: 100%; 
          background: #77909A; 
          padding: 12px 0; 
          border-top: 1px solid rgba(255,255,255,0.1); 
          border-bottom: 1px solid rgba(255,255,255,0.1); 
        }
        .trusted-container { display: flex; align-items: center; justify-content: center; gap: 24px; flex-wrap: wrap; }

        .features-wrapper { width: 100%; background: #3B7A90; padding: 80px 0; }
        .grid-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; width: 100%; }

        .cta-wrapper { width: 100%; background: #3B7A90; padding: 0 0 80px 0; }
        .cta-card { background: #142A63; padding: 50px 40px; border-radius: 16px; text-align: center; width: 100%; }

        .footer-wrapper { width: 100%; background: #4C4747; padding: 60px 0 40px; }
        .footer-container { display: flex; justify-content: space-between; gap: 40px; }

        .footer-bottom-wrapper { width: 100%; background: #1B4472; padding: 20px 0; font-size: 11px; color: #9FC9D9; }
        .footer-bottom-container { display: flex; justify-content: space-between; align-items: center; gap: 20px; }

        @media (max-width: 768px) {
          .container { padding: 0 20px; }
          .hero-wrapper { padding: 120px 0 40px 0; } 
          .hero-container { flex-direction: column-reverse; text-align: center; gap: 20px; }
          .hero-text-block { width: 100% !important; text-align: center !important; max-width: 100% !important; margin-top: 10px !important; }
          .hero-buttons { justify-content: center !important; }
          .hero-image-container { width: 100% !important; height: 260px !important; max-width: 100% !important; margin-top: 10px !important; }
          .trusted-container { flex-direction: column; text-align: center; gap: 10px !important; }
          .grid-container { grid-template-columns: 1fr; gap: 16px; }
          .footer-container { flex-direction: column; gap: 32px; }
          .footer-bottom-container { flex-direction: column; text-align: center; gap: 16px; }
          .footer-bottom-links { justify-content: center; flex-wrap: wrap; gap: 12px !important; }
        }
      `}</style>

      {/* FIXED NAVBAR */}
      <nav style={{
        background: "#071947",    
        width: "100%",
        position: "fixed", 
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000, 
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        height: "90px",               
        display: "flex",
        alignItems: "center",         
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          
          <span onClick={() => navigate("/")} style={{ fontWeight: 900, fontSize: "28px", letterSpacing: "1.5px", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: "pointer" }}>IMS</span>
          
          {!isMobile ? (
            <div className="nav-links" style={{ display: "flex", gap: "14px", alignItems: "center", marginLeft: "auto", justifyContent: "flex-end" }}> 
              {NAV_LINKS.map(link => (
                <a key={link} href="#">{link}</a>
              ))}
            </div>
          ) : (
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "24px" }}>
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          )}
        </div>
      </nav>

      {/* MOBILE DROPDOWN */}
      {isMobile && mobileMenuOpen && (
        <div className="nav-links" style={{ 
          background: "#071947", 
          padding: "24px", 
          display: "flex", 
          flexDirection: "column", 
          gap: "14px", 
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          position: "fixed", 
          top: "90px",      
          left: 0,
          right: 0,
          zIndex: 999
        }}>
          {NAV_LINKS.map(link => (
            <a key={link} href="#" onClick={() => setMobileMenuOpen(false)} style={{ display: "block", textAlign: "center" }}>{link}</a>
          ))}
        </div>
      )}

      {/* HERO SECTION */}
      <div className="hero-wrapper">
        <div className="container hero-container">
          
          {/* Welcome Text Block */}
          <div className="hero-text-block">
            <h1 style={{ fontSize: "42px", fontWeight: 700, lineHeight: 1.2, margin: "0 0 16px", color: "#ffffff", textAlign: "left" }}>
              Welcome to the <br />
              <span style={{ color: "#B8B6B6", display: "block", textAlign: "left" }}>Internship Management</span>
              <span style={{ color: "#ffffff", display: "block", textAlign: "left" }}>System</span>
            </h1>
            <p style={{ fontSize: "15px", color: "#e2e8f0", lineHeight: 1.6, margin: "0 0 28px", maxWidth: "500px", textAlign: "left" }}>
              Digitalizing the journey between students and the university department. Seamlessly track applications, manage credits, and secure your future.
            </p>
            <div className="hero-buttons" style={{ display: "flex", gap: "14px", justifyContent: "flex-start" }}>
              {/* 🚀 මෙතනින් සයින්-අප් පේජ් එකට යනවා */}
              <button 
                onClick={() => navigate("/signup")} 
                style={{ background: "#fff", border: "none", color: "#071947", padding: "12px 28px", borderRadius: "6px", fontWeight: 700, fontSize: "14px", cursor: "pointer", transition: "all 0.2s" }}
              >
                Sign Up
              </button>
              <button 
                onClick={() => navigate("/login")}
                style={{ background: "transparent", border: "1px solid #ffffff", color: "#ffffff", padding: "12px 28px", borderRadius: "6px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
              >
                Login →
              </button>
            </div>
          </div>
          
          {/* Image Container */}
          <div className="hero-image-container" style={{ flex: "1", height: "360px", borderRadius: "12px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.3)", marginTop: "10px" }}>
            <img src={officeImage} alt="Office Setup" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </div>

      {/* TRUSTED BY SECTION */}
      <div className="trusted-wrapper">
        <div className="container trusted-container">
          <span style={{ fontSize: "12px", color: "#071947", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Trusted By</span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <img src={logoImage} alt="UOR Logo" style={{ width: "85%", height: "85%", objectFit: "contain" }} />
            </div>
            <span style={{ fontSize: "14px", color: "#071947", fontWeight: 700 }}>University of Ruhuna</span>
          </div>
          <span style={{ color: "#071947", display: isMobile ? "none" : "inline", fontWeight: 400 }}>|</span>
          <span style={{ fontSize: "14px", color: "#071947", display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>🛡️ Secure Portal</span>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="features-wrapper">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <p style={{ fontSize: "20px", color: "#071947", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Centralized Internship process</p>
            <h2 style={{ fontSize: isMobile ? "15px" : "18px", fontWeight: 400, margin: "0 auto", maxWidth: "700px", lineHeight: 1.4, color: "#ffffff" }}>
              Streamlining collaboration with an integrated, data-driven platform.
            </h2>
          </div>
          <div className="grid-container">
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: f.isHighlighted ? "linear-gradient(135deg, #071947 0%, #142A63 100%)" : "#EAF7FC",
                borderRadius: "12px", padding: "28px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                border: f.isHighlighted ? "none" : "1px solid rgba(7,25,71,0.08)"
              }}>
                <div style={{ marginBottom: "16px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px", color: f.isHighlighted ? "#fff" : "#071947" }}>{f.title}</h3>
                <p style={{ fontSize: "13px", lineHeight: 1.6, color: f.isHighlighted ? "#b9d5f0" : "#334155", margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="cta-wrapper">
        <div className="container">
          <div className="cta-card">
            <h2 style={{ fontSize: isMobile ? "22px" : "30px", fontWeight: 800, margin: "0 0 12px", color: "#fff" }}>Ready to start your professional journey?</h2>
            <p style={{ fontSize: "14px", color: "#9FC9D9", marginBottom: "28px" }}>Join thousands of students today on the most advanced internship platform.</p>
            {/* 🚀 මෙතනිනුත් සයින්-අප් පේජ් එකට යනවා */}
            <button 
              onClick={() => navigate("/signup")}
              style={{ background: "#9FC9D9", color: "#071947", border: "none", padding: "14px 36px", borderRadius: "6px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER SECTION */}
      <div className="footer-wrapper">
        <div className="container footer-container">
          <div style={{ maxWidth: "400px", textAlign: "left" }}>
            <span style={{ fontWeight: 900, fontSize: "18px", color: "#fff", display: "block", marginBottom: "12px" }}>University IMS</span>
            <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>
              The ultimate Internship Management System balancing the path from education to industry excellence. Empowering students of the University of Ruhuna through digital transformation.
            </p>
          </div>
          <div style={{ display: "flex", gap: "60px", textAlign: "left" }}>
            <div>
              <h4 style={{ color: "#fff", fontSize: "13px", textTransform: "uppercase", margin: "0 0 14px", letterSpacing: "0.5px" }}>Portals</h4>
              <span onClick={() => navigate("/login")} style={{ display: "block", color: "#cbd5e1", cursor: "pointer", fontSize: "13px", marginBottom: "10px", fontWeight: 500 }}>Student Login</span>
              <a href="#" style={{ display: "block", color: "#cbd5e1", textDecoration: "none", fontSize: "13px", fontWeight: 500 }}>Admin Portal</a>
            </div>
            <div>
              <h4 style={{ color: "#fff", fontSize: "13px", textTransform: "uppercase", margin: "0 0 14px", letterSpacing: "0.5px" }}>Resources</h4>
              {["Privacy Policy", "Terms of Services", "Contact Support", "University Guidelines"].map(l => (
                <a key={l} href="#" style={{ display: "block", color: "#cbd5e1", textDecoration: "none", fontSize: "13px", marginBottom: "10px", fontWeight: 500 }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BOTTOM BAR */}
      <div className="footer-bottom-wrapper">
        <div className="container footer-bottom-container">
          <span>© 2026 IMS Portal. All rights reserved by the Department of Computer Science.</span>
          <div className="footer-bottom-links" style={{ display: "flex", gap: "20px" }}>
            {["Privacy Policy", "Terms of Service", "Contact Support", "University Guidelines"].map(l => (
              <a key={l} href="#" style={{ color: "#9FC9D9", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
      </div>

    </div>
  ); 
}