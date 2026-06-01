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
    --sidebar-bg:    #dce3ec;
    --sidebar-text:  #1c2d3f;
    --sidebar-sub:   #4a6080;
    --tag-bg:        #3a6fa8;
    --tag-text:      #ffffff;
    --card-bg:       #2e4a6b;
    --card-title:    #e8f0fa;
    --card-text:     #a8bdd4;
    --card-link:     #7ab3e0;
    --card-link-h:   #a8cfee;
    --card-icon-bg:  #1e3a5f;
    --input-bg:      #f0f4f8;
    --input-border:  #b0bfce;
    --input-text:    #4a6080;
    --spec-card-bg:  #1e3a5f;
    --spec-title:    #e8f0fa;
    --spec-text:     #8aaac8;
    --btn-confirm:   #3a6fa8;
    --btn-confirm-h: #4a7fc0;
    --warn-text:     #7ab3e0;
    --footer-bg:     #2e4a6b;
    --footer-text:   #8aaac8;
    --footer-link:   #7ab3e0;
    --border:        rgba(255,255,255,0.08);
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

  /* MAIN — fills remaining height */
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
    color: var(--sidebar-text);
    margin-bottom: 0.75rem;
    text-transform: uppercase;
  }

  /* GRID — fills full width */
  .hub-grid {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 1.5rem;
    align-items: flex-start;
    flex: 1;
    width: 100%;
  }

  /* PROFILE CARD */
  .profile-card {
    background: var(--sidebar-bg);
    border-radius: 6px;
    padding: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }
  .profile-top {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }
  .profile-photo {
    width: 48px;
    height: 60px;
    border-radius: 3px;
    background: #8aaac8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    flex-shrink: 0;
    overflow: hidden;
  }
  .profile-name {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--sidebar-text);
    line-height: 1.3;
  }
  .profile-role {
    font-size: 0.7rem;
    color: var(--sidebar-sub);
    margin-top: 0.15rem;
    line-height: 1.4;
  }
  .profile-divider {
    border: none;
    border-top: 1px solid #b8c8d8;
    margin: 0;
  }
  .profile-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .info-row {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .info-header {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .info-icon { font-size: 0.8rem; }
  .info-label {
    font-size: 0.64rem;
    color: #7a90a8;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
  .info-input {
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: 4px;
    padding: 0.35rem 0.5rem;
    font-size: 0.72rem;
    font-family: var(--mono);
    color: var(--sidebar-text);
    width: 100%;
    outline: none;
    transition: border 0.15s;
  }
  .info-input:focus { border-color: var(--btn-logout); }

  .section-label {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: #7a90a8;
    text-transform: uppercase;
    margin-bottom: 0.45rem;
  }
  .link-input {
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: 4px;
    padding: 0.38rem 0.55rem;
    font-size: 0.72rem;
    font-family: var(--font);
    color: var(--input-text);
    width: 100%;
    margin-bottom: 0.45rem;
    outline: none;
    transition: border 0.15s;
  }
  .link-input:focus { border-color: var(--btn-logout); }
  .link-input::placeholder { color: #9ab0c4; }

  /* MODULES GRID — 2 cols, fills height */
  .modules-area {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 1rem;
  }

  .module-card {
    background: var(--card-bg);
    border-radius: 6px;
    padding: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .module-header {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    margin-bottom: 0.1rem;
  }
  .module-icon {
    width: 26px;
    height: 26px;
    background: var(--card-icon-bg);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    flex-shrink: 0;
  }
  .module-title {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--card-title);
  }
  .module-desc {
    font-size: 0.72rem;
    color: var(--card-text);
    line-height: 1.55;
    text-align: left;
    flex: 1;
  }
  .module-link {
    background: none;
    border: none;
    color: var(--card-link);
    font-family: var(--font);
    font-size: 0.74rem;
    font-weight: 500;
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
  .module-link::after { content: ' →'; }

  /* SPECIALIZATION CARD */
  .spec-card {
    background: var(--spec-card-bg);
    border-radius: 6px;
    padding: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }
  .spec-title {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--spec-title);
  }
  .spec-subtitle {
    font-size: 0.7rem;
    color: var(--spec-text);
    line-height: 1.5;
    text-align: left;
  }
  .spec-select {
    background: #162e4a;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 4px;
    padding: 0.42rem 0.7rem;
    font-size: 0.74rem;
    font-family: var(--font);
    color: var(--spec-text);
    width: 100%;
    outline: none;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238aaac8'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.7rem center;
    transition: border 0.15s;
  }
  .spec-select:focus { border-color: var(--btn-logout); }
  .spec-select option { background: #1e3a5f; color: #d0dcea; }

  .btn-confirm {
    background: var(--btn-confirm);
    border: none;
    color: white;
    font-family: var(--font);
    font-size: 0.76rem;
    font-weight: 500;
    padding: 0.48rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
  }
  .btn-confirm:hover { background: var(--btn-confirm-h); }
  .spec-warning {
    font-size: 0.65rem;
    color: var(--warn-text);
    text-align: center;
    font-style: italic;
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
  const [studentId, setStudentId] = useState("SC/2022/854");
  const [studentEmail, setStudentEmail] = useState("student@university.ruh.ac");

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
                    <span className="tag-gpa">Current GPA: 0.00</span>
                  </div>
                </div>

                <hr className="profile-divider" />

                <div className="profile-info">
                  <div className="info-row">
                    <div className="info-header">
                      <span className="info-icon">🪪</span>
                      <label className="info-label">Student ID</label>
                    </div>
                    <input
                      type="text"
                      className="info-input"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                    />
                  </div>
                  <div className="info-row">
                    <div className="info-header">
                      <span className="info-icon">✉️</span>
                      <label className="info-label">University Email</label>
                    </div>
                    <input
                      type="email"
                      className="info-input"
                      style={{ fontFamily: 'var(--font)' }}
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
              <div className="module-card">
                <div className="module-header">
                  <div className="module-icon">📊</div>
                  <span className="module-title">GPA Calculator</span>
                </div>
                <p className="module-desc">
                  Calculate and simulate your academic standing. Estimate final results based on target grades.
                </p>
                <button className="module-link">Open Module</button>
              </div>

              <div className="module-card">
                <div className="module-header">
                  <div className="module-icon">📄</div>
                  <span className="module-title">Student CV</span>
                </div>
                <p className="module-desc">
                  Upload and manage your professional documents. Keep your resume up to date for recruiters.
                </p>
                <button className="module-link">Manage Files</button>
              </div>

              <div className="module-card">
                <div className="module-header">
                  <div className="module-icon">⭐</div>
                  <span className="module-title">Internship Status</span>
                </div>
                <p className="module-desc">
                  Track your current applications, view selection status, and submit official offer letters.
                </p>
                <button className="module-link">Check Updates</button>
              </div>

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
                <button className="btn-confirm">✔ Confirm &amp; continue</button>
                <p className="spec-warning">Cannot be changed after confirmation</p>
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
