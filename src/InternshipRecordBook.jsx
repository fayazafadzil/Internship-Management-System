import { useState } from "react";

const LockIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-7 9H5v2h14v-2h-7z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const navLinks = ["Overview", "GPA Calculator", "Student CV", "InternshipStatus", "Record Book"];
const weeks = ["Week 01", "Week 02", "Week 03"];
const footerLinks = ["Privacy Policy", "Terms of Services", "Contact Support", "University Guidelines"];

const styles = {
  root: {
    fontFamily: "'Segoe UI', sans-serif",
    background: "#b8ccd8",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    margin: 0,
    padding: 0,
  },
  nav: {
    background: "#1a2636",
    display: "flex",
    alignItems: "center",
    padding: "0 32px",
    height: 56,
    gap: 0,
  },
  navLogo: { color: "#fff", fontWeight: 700, fontSize: 18, marginRight: 40 },
  navLinks: { display: "flex", gap: 0, flex: 1 },
  navLink: (active) => ({
    color: active ? "#fff" : "#cdd8e3",
    textDecoration: "none",
    fontSize: 13.5,
    padding: "0 18px",
    height: 56,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    background: "transparent",
    border: "none",
    transition: "background 0.2s",
  }),
  navRight: { display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" },
  btnLogout: {
    background: "#4a90b8",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    padding: "7px 20px",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 500,
  },
  avatar: {
    width: 36, height: 36,
    background: "#3a4a5c",
    borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#8ca0b3",
  },
  main: { flex: 1, padding: "28px 36px 0" },
  pageTitle: { fontSize: 15, fontWeight: 700, color: "#1a2636", marginBottom: 4 },
  pageSubtitle: { fontSize: 12, color: "#4a6070", marginBottom: 24, maxWidth: 540, lineHeight: 1.5 },
  weekCards: { display: "flex", gap: 20, marginBottom: 24 },
  weekCard: {
    flex: 1,
    background: "#dce9f0",
    borderRadius: 10,
    padding: "16px 18px 18px",
    minHeight: 180,
    display: "flex",
    flexDirection: "column",
  },
  weekCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  weekLabel: { fontSize: 13, fontWeight: 700, color: "#1a2636" },
  lockedBadge: {
    background: "#8fb3c8",
    color: "#fff",
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 700,
    padding: "3px 9px",
    display: "flex", alignItems: "center", gap: 5,
    letterSpacing: 0.5,
  },
  weekCardBody: {
    flex: 1,
    background: "#ccdce6",
    borderRadius: 7,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    minHeight: 110,
    color: "#7a9ab0",
  },
  noActivities: { fontSize: 11, color: "#7a9ab0", fontWeight: 500 },
  weekCardLines: { marginTop: 12, display: "flex", flexDirection: "column", gap: 5 },
  lineBase: { height: 6, background: "#b8ccd8", borderRadius: 3 },
  bottomSection: { display: "flex", gap: 20, alignItems: "stretch", paddingBottom: 0 },
  finalDocCard: {
    background: "#dce9f0",
    borderRadius: 10,
    padding: "20px 22px",
    flex: 1.1,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  finalDocTop: { display: "flex", alignItems: "center", gap: 14 },
  finalDocBadge: {
    background: "#1a2636",
    color: "#fff",
    borderRadius: 4,
    fontSize: 9.5,
    fontWeight: 800,
    padding: "4px 10px",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  pendingBadge: {
    background: "transparent",
    border: "1.5px solid #8fb3c8",
    color: "#4a7a96",
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 600,
    padding: "3px 10px",
    display: "flex", alignItems: "center", gap: 5,
  },
  finalDocTitle: { fontSize: 14, fontWeight: 700, color: "#1a2636" },
  finalDocDesc: { fontSize: 11.5, color: "#4a6070", lineHeight: 1.6, maxWidth: 320 },
  btnDownload: {
    background: "#2a6496",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "10px 18px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex", alignItems: "center", gap: 8,
    width: "fit-content",
  },
  weeksLogged: { fontSize: 11, color: "#6a8a9a", marginLeft: 8, display: "inline-block" },
  availableNote: { fontSize: 10, color: "#8aabb8", letterSpacing: 0.3, textTransform: "uppercase", marginTop: 2 },
  promoCard: {
    flex: 1,
    background: "#1a2636",
    borderRadius: 10,
    padding: "28px 28px 24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 12,
    position: "relative",
    overflow: "hidden",
    minHeight: 200,
  },
  promoLabel: {
    fontSize: 9.5,
    color: "#8ab0c8",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: 700,
  },
  promoHeadline: {
    fontSize: 22,
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1.25,
  },
  promoBody: {
    fontSize: 11.5,
    color: "#8ab0c8",
    lineHeight: 1.65,
  },
  footer: {
    background: "#1a2636",
    padding: "18px 36px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  footerLogo: { color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 3 },
  footerCopy: { fontSize: 10, color: "#6a8a9a" },
  footerLinks: { display: "flex", gap: 24 },
  footerLink: { fontSize: 11, color: "#8aabb8", textDecoration: "none", cursor: "pointer" },
};

export default function IMSRecordBook() {
  const [activeNav, setActiveNav] = useState("Record Book");

  return (
    <div style={styles.root}>
      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>IMS</div>
        <div style={styles.navLinks}>
          {navLinks.map((link) => (
            <button
              key={link}
              style={styles.navLink(activeNav === link)}
              onClick={() => setActiveNav(link)}
            >
              {link}
            </button>
          ))}
        </div>
        <div style={styles.navRight}>
          <button style={styles.btnLogout}>Logout</button>
          <div style={styles.avatar}><UserIcon /></div>
        </div>
      </nav>

      {/* MAIN */}
      <main style={styles.main}>
        <div style={styles.pageTitle}>Internship Record Book</div>
        <div style={styles.pageSubtitle}>
          Track your professional journey. Document your weekly activities, challenges, and achievements to maintain a comprehensive record of your internship progress.
        </div>

        {/* WEEK CARDS */}
        <div style={styles.weekCards}>
          {weeks.map((week) => (
            <div key={week} style={styles.weekCard}>
              <div style={styles.weekCardHeader}>
                <span style={styles.weekLabel}>{week}</span>
                <span style={styles.lockedBadge}>
                  <LockIcon size={10} /> LOCKED
                </span>
              </div>
              <div style={styles.weekCardBody}>
                <div style={{ color: "#7a9ab0" }}><LockIcon size={34} /></div>
                <span style={styles.noActivities}>No activities recorded</span>
              </div>
              <div style={styles.weekCardLines}>
                <div style={{ ...styles.lineBase, width: "100%" }} />
                <div style={{ ...styles.lineBase, width: "75%" }} />
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM SECTION */}
        <div style={styles.bottomSection}>
          {/* Final Document Card */}
          <div style={styles.finalDocCard}>
            <div style={styles.finalDocTop}>
              <span style={styles.finalDocBadge}>Final Document</span>
              <span style={styles.pendingBadge}>
                <LockIcon size={11} /> Pending Completion
              </span>
            </div>
            <div style={styles.finalDocTitle}>Final Internship Report</div>
            <div style={styles.finalDocDesc}>
              Your formal internship assessment dossier. This document is automatically compiled from your weekly contributions and forms the basis of your professional evaluation.
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
              <button style={styles.btnDownload}>
                <DownloadIcon /> Download Report
              </button>
              <span style={styles.weeksLogged}>3 of 24 Weeks Logged</span>
            </div>
            <div style={styles.availableNote}>Available after Week 24 submission</div>
          </div>

          {/* Promo Card */}
          <div style={styles.promoCard}>
            <div style={styles.promoLabel}>Institutional Progress</div>
            <div style={styles.promoHeadline}>
              Consistent documentation builds<br />professional authority.
            </div>
            <div style={styles.promoBody}>
              Your record book serves as a verified history of your growth.<br />
              Ensure all entries are submitted by Friday EOD for timely review.
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div>
          <div style={styles.footerLogo}>IMS</div>
          <div style={styles.footerCopy}>© 2026 IMS Portal. All rights reserved by the Department of Computer Science.</div>
        </div>
        <div style={styles.footerLinks}>
          {footerLinks.map((link) => (
            <span key={link} style={styles.footerLink}>{link}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
