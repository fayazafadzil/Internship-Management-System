import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-page:       #9fc9d9;
    --nav-bg:         #071947;
    --nav-text:      #d0dcea;
    --nav-hover:     rgba(255,255,255,0.12);
    --btn-logout:    #3a6fa8;
    --btn-logout-h:  #4a7fc0;
    --sidebar-bg:    #cfe2ec;
    --sidebar-text:  #142534;
    --sidebar-sub:   #4a6080;
    --tag-bg:        #e2b4f2;
    --tag-text:      #602375;
    
    /* UI Page Light Blue Theme */
    --card-bg:       #dbeaf4;
    --card-header:   #1a3a60;
    --card-title:    #1c2d3f;
    --card-text:     #3e5268;
    --card-link:     #124c8c;
    --card-link-h:   #3a6fa8;
    --card-icon-bg:  #ffffff;
    
    --input-bg:      #ffffff;
    --input-border:  #b0bfce;
    --input-text:    #1c2d3f;
    
    --spec-card-bg:  #3b82b6;
    --spec-title:    #ffffff;
    --spec-text:     #e2effa;
    --btn-confirm:   #091b3d;
    --btn-confirm-h: #132e63;
    --warn-text:     #cfe2ec;
    
    --footer-bg:     #122d54;
    --footer-text:   #8aaac8;
    --footer-link:   #7ab3e0;
    --border:        rgba(0,0,0,0.06);
    --font: 'IBM Plex Sans', sans-serif;
    --mono: 'IBM Plex Mono', monospace;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .ims-root {
    font-family: var(--font);
    background: var(--bg-page);
    height: 100vh;
    width: 100vw;
    color: var(--sidebar-text);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* NAV */
  .ims-nav {
    background: var(--nav-bg);
    padding: 0 2rem;
    height: 52px;
    min-height: 52px;
    display: flex;
    align-items: center;
    z-index: 100;
    flex-shrink: 0;
  }
  .ims-logo {
    font-weight: 700;
    font-size: 1rem;
    color: #ffffff;
    letter-spacing: 0.1em;
  }
  .ims-nav-spacer { flex: 1; }
  .ims-nav-links {
    display: flex;
    align-items: center;
    gap: 0.1rem;
    margin-right: 1.5rem;
  }
  .nav-link {
    background: none;
    border: none;
    color: var(--nav-text);
    font-family: var(--font);
    font-size: 0.8rem;
    font-weight: 400;
    padding: 0.38rem 0.85rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .nav-link:hover, .nav-link.active {
    background: var(--nav-hover);
    color: #ffffff;
  }
  .nav-right {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }
  .btn-logout {
    background: var(--btn-logout);
    border: none;
    color: white;
    font-family: var(--font);
    font-size: 0.78rem;
    font-weight: 500;
    padding: 0.32rem 0.9rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn-logout:hover { background: var(--btn-logout-h); }
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--btn-logout);
    border: 2px solid rgba(255,255,255,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 600;
    color: white;
    cursor: pointer;
  }

  /* MAIN */
  .ims-main {
    flex: 1;
    padding: 1.25rem 2rem 1rem;
    width: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .hub-title {
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #0b1a30;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
  }

  /* GRID */
  .hub-grid {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 1.5rem;
    align-items: flex-start;
    flex: 1;
    width: 100%;
  }

  /* PROFILE CARD (Compact Size) */
  .profile-card {
    background: var(--sidebar-bg);
    border-radius: 6px;
    padding: 0.95rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .profile-top {
    display: flex;
    gap: 0.65rem;
    align-items: flex-start;
  }
  .profile-photo {
    width: 44px;
    height: 55px;
    border-radius: 3px;
    background: #8aaac8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    flex-shrink: 0;
    overflow: hidden;
  }
  .profile-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--sidebar-text);
    line-height: 1.2;
  }
  .profile-role {
    font-size: 0.68rem;
    color: var(--sidebar-sub);
    margin-top: 0.15rem;
    line-height: 1.3;
  }
  .tag-gpa {
    display: inline-block;
    font-size: 0.6rem;
    font-weight: 700;
    background: #ffffff;
    color: #5c728a;
    padding: 0.1rem 0.35rem;
    border: 1px solid #b8c8d8;
    border-radius: 3px;
    margin-top: 0.3rem;
  }
  .profile-divider {
    border: none;
    border-top: 1px solid #b8c8d8;
    margin: 0;
  }
  .profile-info {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }
  .info-row {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .info-header {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
  .info-icon { font-size: 0.75rem; }
  .info-label {
    font-size: 0.62rem;
    color: #5c728a;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
  
  /* Input Boxes Style */
  .info-input {
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: 4px;
    padding: 0.35rem 0.5rem;
    font-size: 0.74rem;
    font-family: var(--font);
    color: var(--sidebar-text);
    width: 100%;
    outline: none;
    transition: border-color 0.15s;
  }
  .info-input:focus {
    border-color: #1a3a60;
  }
  .info-input::placeholder {
    color: #a0b2c6;
  }

  .section-label {
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: #5c728a;
    text-transform: uppercase;
    margin-bottom: 0.35rem;
  }
  .link-input {
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: 4px;
    padding: 0.3rem 0.45rem;
    font-size: 0.72rem;
    font-family: var(--font);
    color: var(--input-text);
    width: 100%;
    margin-bottom: 0.35rem;
    outline: none;
  }

  /* COMPACT MODULES GRID */
  .modules-area {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 1rem;
  }

  .module-card {
    background: #eef5fa;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  }

  .card-top-bar {
    background: #1e3d6b;
    padding: 0.45rem 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }
  .module-icon-text {
    font-size: 0.8rem;
    color: #ffffff;
  }
  .module-title {
    font-size: 0.78rem;
    font-weight: 600;
    color: #ffffff;
  }
  
  .card-body-content {
    padding: 0.8rem 0.9rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }
  .module-desc {
    font-size: 0.72rem;
    color: var(--card-text);
    line-height: 1.4;
    text-align: left;
    flex: 1;
  }
  .module-link {
    background: none;
    border: none;
    color: var(--card-link);
    font-family: var(--font);
    font-size: 0.74rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    text-align: left;
    transition: color 0.15s;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-top: auto;
  }
  .module-link:hover { color: var(--card-link-h); }

  /* SPECIALIZATION CARD */
  .spec-card {
    background: var(--spec-card-bg);
    border-radius: 6px;
    padding: 0.95rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  }
  .spec-title {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--spec-title);
  }
  .spec-subtitle {
    font-size: 0.68rem;
    color: var(--spec-text);
    line-height: 1.35;
    text-align: left;
  }
  .spec-select {
    background: #ffffff;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 4px;
    padding: 0.35rem 0.55rem;
    font-size: 0.72rem;
    font-family: var(--font);
    color: #1a3a60;
    width: 100%;
    outline: none;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%231a3a60'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.65rem center;
  }

  .btn-confirm {
    background: var(--btn-confirm);
    border: none;
    color: white;
    font-family: var(--font);
    font-size: 0.74rem;
    font-weight: 500;
    padding: 0.4rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    margin-top: 0.15rem;
  }
  .btn-confirm:hover { background: var(--btn-confirm-h); }
  .spec-warning {
    font-size: 0.6rem;
    color: var(--warn-text);
    text-align: center;
    opacity: 0.85;
  }

  /* FOOTER */
  .ims-footer {
    background: var(--footer-bg);
    padding: 0.75rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
    flex-shrink: 0;
  }
  .footer-brand {
    font-size: 0.75rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.06em;
  }
  .footer-copy {
    font-size: 0.63rem;
    color: var(--footer-text);
    margin-top: 0.1rem;
  }
  .footer-links {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    align-items: center;
  }
  .footer-link {
    background: none;
    border: none;
    color: var(--footer-link);
    font-family: var(--font);
    font-size: 0.7rem;
    cursor: pointer;
    transition: color 0.15s;
    padding: 0;
  }
  .footer-link:hover { color: #ffffff; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg-page); }
  ::-webkit-scrollbar-thumb { background: #8aaac8; border-radius: 3px; }
`;

export default function IMSManagementHub() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [specialization, setSpecialization] = useState("");
  
  // State variables are empty by default, allowing fresh user input
  const [studentId, setStudentId] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  const navItems = ["Overview", "GPA Calculator", "Student CV", "Internship Status", "Record Book"];

  return (
    <>
      <style>{styles}</style>
      <div className="ims-root">

        {/* NAV */}
        <nav className="ims-nav">
          <span className="ims-logo">IMS</span>
          <div className="ims-nav-spacer"></div>
          <div className="ims-nav-links">
            {navItems.map((item) => (
              <button
                key={item}
                className={`nav-link${activeNav === item ? " active" : ""}`}
                onClick={() => setActiveNav(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="nav-right">
            <button className="btn-logout">Logout</button>
            <div className="avatar">JD</div>
          </div>
        </nav>

        {/* MAIN */}
        <main className="ims-main">
          <div className="hub-grid">

            {/* LEFT PROFILE SIDE */}
            <div>
              <p className="hub-title">Management Hub</p>
              <div className="profile-card">
                <div className="profile-top">
                  <div className="profile-photo">🧑‍💼</div>
                  <div>
                    <div className="profile-name">John Doe</div>
                    <div className="profile-role">Computer Science Undergraduate</div>
                    <span className="tag-gpa">CURRENT GPA : 0.00</span>
                  </div>
                </div>

                <hr className="profile-divider" />

                <div className="profile-info">
                  <div className="info-row">
                    <div className="info-header">
                      <span className="info-icon">🪪</span>
                      <label className="info-label">Student ID</label>
                    </div>
                    {/* Empty Box ready for user typing */}
                    <input 
                      type="text" 
                      className="info-input"
                      placeholder="Enter Student ID"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                    />
                  </div>
                  <div className="info-row">
                    <div className="info-header">
                      <span className="info-icon">✉️</span>
                      <label className="info-label">University Email</label>
                    </div>
                    {/* Empty Box ready for user typing */}
                    <input 
                      type="email" 
                      className="info-input"
                      placeholder="Enter University Email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                    />
                  </div>
                </div>

                <hr className="profile-divider" />

                <div>
                  <div className="section-label">Professional Links</div>
                  <input
                    className="link-input"
                    placeholder="🔗 LinkedIn Link"
                    value={linkedinLink}
                    onChange={(e) => setLinkedinLink(e.target.value)}
                  />
                  <input
                    className="link-input"
                    placeholder="🐙 GitHub Link"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT MODULES GRID */}
            <div className="modules-area" style={{ marginTop: "2.1rem" }}>
              
              {/* GPA CALCULATOR */}
              <div className="module-card">
                <div className="card-top-bar">
                  <span className="module-icon-text">📊</span>
                  <span className="module-title">GPA Calculator</span>
                </div>
                <div className="card-body-content">
                  <p className="module-desc">
                    Calculate and simulate your academic standing. Estimate final results based on target grades.
                  </p>
                  <button className="module-link">Open Module ➔</button>
                </div>
              </div>

              {/* STUDENT CV */}
              <div className="module-card">
                <div className="card-top-bar">
                  <span className="module-icon-text">📄</span>
                  <span className="module-title">Student CV</span>
                </div>
                <div className="card-body-content">
                  <p className="module-desc">
                    Upload and manage your professional documents. Keep your resume up to date for recruiters.
                  </p>
                  <button className="module-link">Manage Files ➔</button>
                </div>
              </div>

              {/* INTERNSHIP STATUS */}
              <div className="module-card">
                <div className="card-top-bar">
                  <span className="module-icon-text">⭐</span>
                  <span className="module-title">Internship Status</span>
                </div>
                <div className="card-body-content">
                  <p className="module-desc">
                    Track your current applications, view selection status, and submit official offer letters.
                  </p>
                  <button className="module-link">Check Updates ➔</button>
                </div>
              </div>

              {/* SPECIALIZATION */}
              <div className="spec-card">
                <div className="spec-title">Choose your specialization</div>
                <p className="spec-subtitle">
                  This sets your internship track. Choose carefully — this cannot be changed after setup.
                </p>
                <select
                  className="spec-select"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                >
                  <option value="">Select an option...</option>
                  <option value="se">Software Engineering</option>
                  <option value="ds">Data Science</option>
                  <option value="cn">Computer Networks</option>
                  <option value="ai">Artificial Intelligence</option>
                  <option value="cy">Cybersecurity</option>
                </select>
                <button className="btn-confirm">➔ Confirm &amp; continue</button>
                <p className="spec-warning">Selection will be locked after confirmation</p>
              </div>
            </div>

          </div>
        </main>

        {/* FOOTER */}
        <footer className="ims-footer">
          <div>
            <div className="footer-brand">IMS</div>
            <div className="footer-copy">
              © 2026 IMS Portal. All rights reserved by the Department of Computer Science.
            </div>
          </div>
          <div className="footer-links">
            {["Privacy Policy", "Terms of Services", "Contact Support", "University Guidelines"].map((l) => (
              <button key={l} className="footer-link">{l}</button>
            ))}
          </div>
        </footer>

      </div>
    </>
  );
}