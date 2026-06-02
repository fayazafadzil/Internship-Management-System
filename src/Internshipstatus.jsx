import { useState, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ims-root {
    font-family: 'DM Sans', sans-serif;
    background: #c8d8e8;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* NAV */
  .ims-nav {
    background: #0d1b2e;
    display: flex;
    align-items: center;
    padding: 0 32px;
    height: 52px;
    gap: 0;
  }
  .ims-logo {
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    font-size: 18px;
    color: #ffffff;
    margin-right: 40px;
    letter-spacing: 0.04em;
  }
  .ims-nav-links {
    display: flex;
    gap: 4px;
    flex: 1;
  }
  .ims-nav-link {
    color: #a8bcd0;
    font-size: 13px;
    font-weight: 500;
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
    text-decoration: none;
    border: none;
    background: none;
  }
  .ims-nav-link:hover { color: #fff; background: rgba(255,255,255,0.07); }
  .ims-nav-link.active { color: #fff; }
  .ims-nav-right { display: flex; align-items: center; gap: 10px; }
  .ims-logout-btn {
    background: #1e3a5f;
    color: #c8d8e8;
    border: none;
    border-radius: 20px;
    padding: 6px 18px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.15s;
  }
  .ims-logout-btn:hover { background: #274d7a; }
  .ims-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: #2a4a6e;
    border: 2px solid #3a6491;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
  }
  .ims-avatar svg { color: #8bb0d0; }

  /* MAIN */
  .ims-main {
    flex: 1;
    padding: 28px 32px 40px;
    max-width: 1100px;
    width: 100%;
    margin: 0 auto;
  }

  .ims-page-title {
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #1a2e45;
    margin-bottom: 4px;
    letter-spacing: 0.02em;
  }
  .ims-page-subtitle {
    font-size: 12px;
    color: #4a6480;
    margin-bottom: 22px;
    max-width: 400px;
    line-height: 1.6;
  }

  /* SELECTION CARDS ROW */
  .ims-selection-row {
    display: grid;
    grid-template-columns: 1fr 1fr 260px;
    gap: 14px;
    margin-bottom: 20px;
    align-items: start;
  }

  .ims-status-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 18px 20px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s;
    position: relative;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .ims-status-card:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.1); transform: translateY(-1px); }
  .ims-status-card.selected {
    border-color: #2a6496;
    background: #f0f6fc;
  }

  .ims-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .ims-card-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: #1e3a5f;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ims-card-icon svg { color: #fff; }
  .ims-card-icon.muted { background: #d0dde8; }
  .ims-card-icon.muted svg { color: #7a9ab5; }

  .ims-radio {
    width: 18px; height: 18px;
    border-radius: 50%;
    border: 2px solid #b0c4d8;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
    flex-shrink: 0;
  }
  .ims-radio.checked { border-color: #2a6496; background: #2a6496; }
  .ims-radio.checked::after {
    content: ''; width: 7px; height: 7px;
    border-radius: 50%; background: #fff;
  }

  .ims-card-title {
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #1a2e45;
    margin-bottom: 6px;
  }
  .ims-card-desc {
    font-size: 12px;
    color: #5a7898;
    line-height: 1.6;
  }

  /* PROGRESS */
  .ims-progress-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 18px 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .ims-progress-title {
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #1a2e45;
    margin-bottom: 16px;
    letter-spacing: 0.02em;
  }
  .ims-steps { display: flex; flex-direction: column; gap: 14px; }
  .ims-step { display: flex; align-items: flex-start; gap: 12px; }
  .ims-step-dot-wrap { display: flex; flex-direction: column; align-items: center; }
  .ims-step-dot {
    width: 14px; height: 14px;
    border-radius: 50%;
    border: 2px solid #b0c4d8;
    background: #fff;
    flex-shrink: 0;
    transition: all 0.2s;
  }
  .ims-step-dot.active { border-color: #2a6496; background: #2a6496; }
  .ims-step-dot.done { border-color: #4caf82; background: #4caf82; }
  .ims-step-line {
    width: 2px; height: 20px;
    background: #d8e6f0;
    margin-top: 3px;
  }
  .ims-step-name {
    font-size: 12px;
    font-weight: 600;
    color: #1a2e45;
    line-height: 1.2;
  }
  .ims-step-name.muted { color: #8aabca; }
  .ims-step-sub { font-size: 11px; color: #7a9ab5; margin-top: 2px; }

  /* FORM SECTION */
  .ims-form-section {
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .ims-form-header {
    background: #1e3a5f;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ims-form-header-title {
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ims-lock-btn {
    width: 34px; height: 34px;
    border-radius: 8px;
    background: rgba(255,255,255,0.1);
    border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background 0.15s;
  }
  .ims-lock-btn:hover { background: rgba(255,255,255,0.18); }

  .ims-form-body { padding: 24px 24px 20px; }
  .ims-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    margin-bottom: 18px;
  }
  .ims-field { display: flex; flex-direction: column; gap: 6px; }
  .ims-label {
    font-size: 12px;
    font-weight: 600;
    color: #2a3f58;
    letter-spacing: 0.02em;
  }
  .ims-label span { color: #e05050; margin-left: 2px; }
  .ims-input {
    border: 1.5px solid #d0dde8;
    border-radius: 8px;
    padding: 9px 13px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: #1a2e45;
    background: #f8fafc;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .ims-input::placeholder { color: #a0b8cc; }
  .ims-input:focus { border-color: #2a6496; box-shadow: 0 0 0 3px rgba(42,100,150,0.1); background: #fff; }

  /* DROPZONE */
  .ims-dropzone {
    border: 2px dashed #b8cfe0;
    border-radius: 10px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    background: #f5f9fc;
    transition: all 0.2s;
    margin-bottom: 18px;
  }
  .ims-dropzone:hover, .ims-dropzone.drag-over {
    border-color: #2a6496;
    background: #eef5fb;
  }
  .ims-dropzone-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    background: #1e3a5f;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 12px;
  }
  .ims-dropzone-text { font-size: 13px; font-weight: 600; color: #1a2e45; margin-bottom: 4px; }
  .ims-dropzone-sub { font-size: 12px; color: #7a9ab5; }
  .ims-file-chip {
    display: inline-flex; align-items: center; gap: 8px;
    background: #e8f2fb; border-radius: 8px;
    padding: 8px 14px; font-size: 12px;
    color: #1e4a7a; font-weight: 500; margin-top: 8px;
  }
  .ims-file-chip button {
    background: none; border: none; cursor: pointer;
    color: #5a7898; font-size: 14px; line-height: 1;
    padding: 0; margin-left: 4px;
  }

  /* DISCLAIMER */
  .ims-disclaimer {
    background: #eef4fa;
    border-radius: 8px;
    padding: 10px 14px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 20px;
  }
  .ims-disclaimer-icon {
    width: 20px; height: 20px;
    border-radius: 50%;
    background: #2a6496;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .ims-disclaimer-text { font-size: 11.5px; color: #4a6480; line-height: 1.5; font-style: italic; }

  /* SUBMIT */
  .ims-submit-row { display: flex; justify-content: flex-end; }
  .ims-submit-btn {
    background: #1e3a5f;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 11px 26px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    letter-spacing: 0.02em;
  }
  .ims-submit-btn:hover { background: #274d7a; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(30,58,95,0.3); }
  .ims-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* SUCCESS TOAST */
  .ims-toast {
    position: fixed; top: 70px; right: 28px;
    background: #1e3a5f; color: #fff;
    border-radius: 10px; padding: 12px 18px;
    font-size: 13px; font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    display: flex; align-items: center; gap: 10px;
    z-index: 100;
    animation: slideIn 0.3s ease;
  }
  @keyframes slideIn {
    from { transform: translateX(30px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  /* FOOTER */
  .ims-footer {
    background: #0d1b2e;
    padding: 18px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .ims-footer-brand { font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700; color: #fff; }
  .ims-footer-copy { font-size: 11px; color: #6080a0; margin-top: 3px; }
  .ims-footer-links { display: flex; gap: 24px; }
  .ims-footer-link { font-size: 12px; color: #7a9ab5; cursor: pointer; transition: color 0.15s; }
  .ims-footer-link:hover { color: #fff; }
`;

export default function IMSInternshipTracker() {
  const [selected, setSelected] = useState("selected");
  const [companyName, setCompanyName] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") setFile(dropped);
  };

  const handleFileChange = (e) => {
    const picked = e.target.files[0];
    if (picked) setFile(picked);
  };

  const handleSubmit = () => {
    if (!companyName || !jobPosition || !file) return;
    setToast("Submitted for review successfully!");
    setTimeout(() => setToast(null), 3500);
  };

  const canSubmit = companyName.trim() && jobPosition.trim() && file;

  return (
    <>
      <style>{styles}</style>
      <div className="ims-root">
        {/* NAV */}
        <nav className="ims-nav">
          <div className="ims-logo">IMS</div>
          <div className="ims-nav-links">
            {["Overview","GPA Calculator","CV Portfolio","InternshipStatus","Record Book"].map(l => (
              <button key={l} className={`ims-nav-link${l==="InternshipStatus"?" active":""}`}>{l}</button>
            ))}
          </div>
          <div className="ims-nav-right">
            <button className="ims-logout-btn">Logout</button>
            <div className="ims-avatar">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
        </nav>

        {/* MAIN */}
        <main className="ims-main">
          <div className="ims-page-title">Internship Placement Tracking</div>
          <div className="ims-page-subtitle">
            Update your current placement status. If you have secured an internship, please provide the details for department verification.
          </div>

          {/* SELECTION ROW */}
          <div className="ims-selection-row">
            {/* Card 1 */}
            <div className={`ims-status-card${selected==="selected"?" selected":""}`} onClick={() => setSelected("selected")}>
              <div className="ims-card-header">
                <div className="ims-card-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className={`ims-radio${selected==="selected"?" checked":""}`}/>
              </div>
              <div className="ims-card-title">I have been selected</div>
              <div className="ims-card-desc">I have received an offer from a company and am ready to formalize my internship placement for review.</div>
            </div>

            {/* Card 2 */}
            <div className={`ims-status-card${selected==="not-selected"?" selected":""}`} onClick={() => setSelected("not-selected")}>
              <div className="ims-card-header">
                <div className="ims-card-icon muted">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <div className={`ims-radio${selected==="not-selected"?" checked":""}`}/>
              </div>
              <div className="ims-card-title">Not Selected Yet</div>
              <div className="ims-card-desc">I am currently applying to roles or awaiting responses from recruiters. No action needed yet.</div>
            </div>

            {/* Progress */}
            <div className="ims-progress-card">
              <div className="ims-progress-title">Your Progress</div>
              <div className="ims-steps">
                {[
                  { label: "Placement Search", sub: "In Progress", state: "active", last: false },
                  { label: "Pending Approval", sub: "Awaiting department verification", state: "idle", last: false },
                  { label: "Approved", sub: "Ready to access Record Book upon approval", state: "idle", last: true },
                ].map((step, i) => (
                  <div key={i} className="ims-step">
                    <div className="ims-step-dot-wrap">
                      <div className={`ims-step-dot${step.state==="active"?" active":step.state==="done"?" done":""}`}/>
                      {!step.last && <div className="ims-step-line"/>}
                    </div>
                    <div>
                      <div className={`ims-step-name${step.state==="idle"?" muted":""}`}>{step.label}</div>
                      <div className="ims-step-sub">{step.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FORM */}
          {selected === "selected" && (
            <div className="ims-form-section">
              <div className="ims-form-header">
                <div className="ims-form-header-title">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  Formalize Your Offer
                </div>
                <button className="ims-lock-btn">
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </button>
              </div>
              <div className="ims-form-body">
                <div className="ims-form-row">
                  <div className="ims-field">
                    <label className="ims-label">Company Name <span>*</span></label>
                    <input
                      className="ims-input"
                      placeholder="e.g., TechCorp Solutions"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="ims-field">
                    <label className="ims-label">Job Position <span>*</span></label>
                    <input
                      className="ims-input"
                      placeholder="e.g., Software Engineering Intern"
                      value={jobPosition}
                      onChange={e => setJobPosition(e.target.value)}
                    />
                  </div>
                </div>

                {/* Dropzone */}
                <div
                  className={`ims-dropzone${dragOver?" drag-over":""}`}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <input ref={fileInputRef} type="file" accept=".pdf" style={{display:"none"}} onChange={handleFileChange}/>
                  <div className="ims-dropzone-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                      <polyline points="16 16 12 12 8 16"/>
                      <line x1="12" y1="12" x2="12" y2="21"/>
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                    </svg>
                  </div>
                  {file ? (
                    <div>
                      <div className="ims-dropzone-text">File attached</div>
                      <div className="ims-file-chip">
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        </svg>
                        {file.name}
                        <button onClick={e => { e.stopPropagation(); setFile(null); }}>×</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="ims-dropzone-text">Drag and drop your offer letter here</div>
                      <div className="ims-dropzone-sub">or click to browse from your computer</div>
                      <div className="ims-dropzone-sub" style={{marginTop:"4px",fontWeight:"600",color:"#4a7aaa"}}>PDF, MAX 5MB</div>
                    </>
                  )}
                </div>

                <div className="ims-disclaimer">
                  <div className="ims-disclaimer-icon">
                    <svg width="11" height="11" fill="white" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12" stroke="#1e3a5f" strokeWidth="2.5"/>
                      <line x1="12" y1="16" x2="12.01" y2="16" stroke="#1e3a5f" strokeWidth="2.5"/>
                    </svg>
                  </div>
                  <div className="ims-disclaimer-text">
                    By submitting, you agree that the provided information is accurate for the formal internship validation process.
                  </div>
                </div>

                <div className="ims-submit-row">
                  <button className="ims-submit-btn" onClick={handleSubmit} disabled={!canSubmit}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Submit for Review
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer className="ims-footer">
          <div>
            <div className="ims-footer-brand">IMS</div>
            <div className="ims-footer-copy">© 2026 IMS Portal. All rights reserved by the Department of Computer Science.</div>
          </div>
          <div className="ims-footer-links">
            {["Privacy  Public","Terms of Services","Contact Support","University Guidelines"].map(l => (
              <span key={l} className="ims-footer-link">{l}</span>
            ))}
          </div>
        </footer>

        {/* TOAST */}
        {toast && (
          <div className="ims-toast">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4caf82" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {toast}
          </div>
        )}
      </div>
    </>
  );
}
