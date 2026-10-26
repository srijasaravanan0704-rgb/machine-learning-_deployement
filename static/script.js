
/* ==========================================
   PHISHSHIFT — PROFESSIONAL SECURITY UI
   Clean • Modern • Responsive
========================================== */

@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

:root {
  color-scheme: dark;

  --bg: #090e18;
  --surface: #101827;
  --surface-2: #151f31;
  --surface-3: #0c1422;

  --border: #263349;
  --border-hover: #3b506b;

  --text: #edf3ff;
  --muted: #96a5bd;
  --faint: #6e7f99;

  --accent: #73e6ce;
  --accent-hover: #91f4df;
  --purple: #9b9cff;

  --green: #69e3bb;
  --yellow: #ffcc78;
  --red: #ff7c91;

  --radius: 16px;
  --radius-sm: 11px;

  --shadow:
    0 18px 45px rgba(0, 0, 0, 0.18);
}

/* RESET */

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;

  background:
    radial-gradient(
      ellipse at 50% -15%,
      rgba(91, 111, 191, 0.12),
      transparent 45%
    ),
    var(--bg);

  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  line-height: 1.65;

  -webkit-font-smoothing: antialiased;
}

button,
textarea,
input,
select {
  font: inherit;
}

button {
  -webkit-tap-highlight-color: transparent;
}

::selection {
  background: rgba(115, 230, 206, 0.28);
  color: white;
}

/* PAGE LAYOUT */

.container {
  width: min(1040px, calc(100% - 40px));
  margin: 0 auto;
  padding: 32px 0 24px;
}

/* HEADER */

.header {
  text-align: center;
  margin: 10px auto 34px;
  max-width: 700px;
}

.header h1 {
  margin: 0 0 12px;

  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(34px, 5vw, 49px);
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -1.8px;

  color: var(--text);
}

.header h1 span {
  color: var(--accent);
}

.header p {
  max-width: 590px;
  margin: 0 auto;

  color: var(--muted);
  font-size: 15px;
  line-height: 1.85;
}

/* CARDS */

.panel {
  min-width: 0;
  padding: 27px;
  margin-bottom: 22px;

  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);

  box-shadow: var(--shadow);

  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.panel:hover {
  border-color: #30435e;
}

.panel h2 {
  margin: 0 0 8px;

  color: var(--text);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.panel h3 {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 600;
}

.panel p {
  color: var(--muted);
}

/* SECTION DESCRIPTIONS */

.panel h2 + p {
  margin: 0 0 20px;
  font-size: 13px;
  line-height: 1.7;
}

/* MESSAGE INPUT */

textarea {
  display: block;
  width: 100%;
  min-height: 185px;
  padding: 18px;

  resize: vertical;
  outline: none;

  color: var(--text);
  background: var(--surface-3);

  border: 1px solid #2a3850;
  border-radius: 12px;

  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  line-height: 1.8;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

textarea::placeholder {
  color: #6d7c94;
}

textarea:hover {
  border-color: var(--border-hover);
}

textarea:focus {
  border-color: var(--accent);

  box-shadow:
    0 0 0 3px rgba(115, 230, 206, 0.09);
}

/* CHARACTER COUNTER */

#charCount {
  display: block;
  margin-top: 8px;
  text-align: right;

  color: var(--faint);
  font-size: 12px;
}

/* BUTTONS */

button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  min-height: 42px;
  padding: 10px 16px;

  color: var(--text);
  background: var(--surface-2);

  border: 1px solid var(--border);
  border-radius: var(--radius-sm);

  font-size: 13px;
  font-weight: 600;

  cursor: pointer;

  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

button:hover:not(:disabled) {
  background: #202d42;
  border-color: #455a76;
}

button:active:not(:disabled) {
  transform: scale(0.98);
}

button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

button:disabled {
  opacity: 0.65;
  cursor: wait;
  transform: none;
}

/* PRIMARY SCAN BUTTON */

#scanButton {
  min-height: 47px;
  padding: 12px 23px;

  color: #071812;
  background: var(--accent);
  border-color: var(--accent);

  font-size: 14px;
  font-weight: 700;

  box-shadow:
    0 5px 18px rgba(115, 230, 206, 0.10);
}

#scanButton:hover:not(:disabled) {
  color: #071812;
  background: var(--accent-hover);
  border-color: var(--accent-hover);

  box-shadow:
    0 7px 22px rgba(115, 230, 206, 0.18);

  transform: translateY(-1px);
}

/* SECONDARY ACTIONS */

#clearButton,
#copyButton,
#downloadButton,
#clearHistoryButton {
  background: #151f30;
}

#clearButton:hover,
#copyButton:hover,
#downloadButton:hover,
#clearHistoryButton:hover {
  background: #202d42;
}

/* SAMPLE BUTTONS */

#sampleSafe {
  color: var(--green);
  background: rgba(105, 227, 187, 0.06);
  border-color: rgba(105, 227, 187, 0.22);
}

#sampleSuspicious {
  color: var(--yellow);
  background: rgba(255, 204, 120, 0.06);
  border-color: rgba(255, 204, 120, 0.22);
}

#samplePhishing {
  color: var(--red);
  background: rgba(255, 124, 145, 0.06);
  border-color: rgba(255, 124, 145, 0.22);
}

/* ERROR MESSAGE */

#errorMessage:not([hidden]) {
  display: block;
  margin: 15px 0 0;
  padding: 12px 15px;

  color: #ff9eae;
  background: rgba(255, 83, 112, 0.08);

  border: 1px solid rgba(255, 83, 112, 0.22);
  border-radius: 10px;

  font-size: 13px;
}

/* RESULT PANEL
   Important: respects the hidden attribute
   used by the existing JavaScript.
*/

#result[hidden] {
  display: none !important;
}

#result:not([hidden]) {
  display: block;
  animation: appear 0.3s ease both;
}

#result {
  scroll-margin-top: 24px;
}

#result h2 {
  margin: 0 0 16px;
}

/* RESULT BADGE */

.result-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  max-width: 100%;
  padding: 6px 11px;
  margin-bottom: 16px;

  color: var(--muted);
  background: #1b2639;
  border: 1px solid var(--border);
  border-radius: 8px;

  font-size: 12px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.result-badge::before {
  content: "";
  width: 7px;
  height: 7px;
  flex-shrink: 0;

  background: currentColor;
  border-radius: 50%;
}

.result-badge.safe {
  color: var(--green);
  background: rgba(105, 227, 187, 0.07);
  border-color: rgba(105, 227, 187, 0.22);
}

.result-badge.warning {
  color: var(--yellow);
  background: rgba(255, 204, 120, 0.07);
  border-color: rgba(255, 204, 120, 0.22);
}

.result-badge.danger {
  color: var(--red);
  background: rgba(255, 124, 145, 0.07);
  border-color: rgba(255, 124, 145, 0.22);
}

/* STATUS */

#status {
  margin: 0 0 10px;
  color: var(--text);
  font-size: 19px;
  font-weight: 700;
}

/* RISK SCORE */

#risk {
  display: inline-block;
  margin: 4px 0 12px;

  color: var(--accent);
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(34px, 5vw, 43px);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -1.3px;

  font-variant-numeric: tabular-nums;
}

/* RISK PROGRESS TRACK */

#riskBar {
  height: 8px;
  width: 0;

  background: var(--accent);
  border-radius: 20px;

  transition:
    width 0.65s cubic-bezier(0.2, 0.75, 0.2, 1),
    background 0.25s ease;
}

#riskBar {
  max-width: 100%;
}

/* If a parent progress container exists */

#riskBarContainer,
.risk-track,
.risk-progress {
  width: 100%;
  height: 8px;
  overflow: hidden;

  background: #263247;
  border-radius: 20px;
}

/* RISK DESCRIPTION */

#riskDescription {
  margin: 10px 0 20px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}

/* SIGNALS */

#signals {
  display: grid;
  gap: 10px;

  margin: 16px 0;
  padding: 0;

  list-style: none;
}

#signals li {
  position: relative;
  padding: 13px 15px 13px 39px;

  color: #d5dfef;
  background: #141f30;

  border: 1px solid #26354a;
  border-radius: 10px;

  font-size: 13px;
  line-height: 1.75;

  overflow-wrap: anywhere;
  animation: appear 0.25s ease both;
}

#signals li::before {
  content: "!";
  position: absolute;
  left: 13px;
  top: 14px;

  display: grid;
  place-items: center;

  width: 17px;
  height: 17px;

  color: var(--yellow);
  background: rgba(255, 204, 120, 0.12);
  border-radius: 50%;

  font-size: 11px;
  font-weight: 800;
}

#noSignals:not([hidden]) {
  display: block;
  margin: 12px 0;

  color: var(--muted);
  font-size: 13px;
}

/* RECOMMENDATION */

#recommendation {
  margin: 14px 0 18px;
  padding: 17px 18px;

  color: #d4deef;
  background: rgba(132, 145, 255, 0.055);

  border: 1px solid rgba(132, 145, 255, 0.17);
  border-left: 3px solid var(--purple);
  border-radius: 10px;

  font-size: 13px;
  line-height: 1.9;

  overflow-wrap: anywhere;
}

/* RESULT ACTIONS */

#copyButton,
#downloadButton {
  margin: 5px 7px 0 0;
}

/* HISTORY */

#historyList {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  min-width: 0;
  padding: 15px 16px;

  background: #0c1422;
  border: 1px solid #253249;
  border-radius: 12px;

  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.history-item:hover {
  background: #131e30;
  border-color: #3b4d68;
}

.history-details {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.history-details strong {
  color: var(--text);
  font-size: 13px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.history-details span {
  color: var(--faint);
  font-size: 12px;
}

.history-risk {
  flex-shrink: 0;
  padding: 5px 9px;

  color: var(--accent);
  background: rgba(115, 230, 206, 0.07);
  border: 1px solid rgba(115, 230, 206, 0.15);
  border-radius: 8px;

  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.empty-history {
  margin: 0;
  padding: 25px 18px;

  color: var(--muted);
  background: #0c1422;
  border: 1px dashed #304058;
  border-radius: 12px;

  text-align: center;
  font-size: 13px;
}

/* FOOTER */

footer {
  padding: 20px 10px 30px;

  color: var(--faint);
  text-align: center;
  font-size: 12px;
  line-height: 1.9;
}

/* SCROLLBAR */

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg);
}

::-webkit-scrollbar-thumb {
  background: #304058;
  border: 2px solid var(--bg);
  border-radius: 20px;
}

::-webkit-scrollbar-thumb:hover {
  background: #506681;
}

/* ANIMATION */

@keyframes appear {
  from {
    opacity: 0;
    transform: translateY(7px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* TABLET */

@media (max-width: 768px) {
  .container {
    width: min(100% - 30px, 620px);
    padding-top: 24px;
  }

  .header {
    margin: 12px auto 25px;
  }

  .header h1 {
    font-size: clamp(32px, 7vw, 42px);
    letter-spacing: -1.2px;
  }

  .header p {
    font-size: 14px;
  }

  .panel {
    padding: 21px;
    margin-bottom: 17px;
  }

  .panel h2 {
    font-size: 19px;
  }
}

/* MOBILE */

@media (max-width: 480px) {
  .container {
    width: calc(100% - 24px);
    padding-top: 17px;
  }

  .header {
    margin-bottom: 22px;
  }

  .header h1 {
    font-size: 31px;
  }

  .header p {
    font-size: 13px;
  }

  .panel {
    padding: 17px;
    border-radius: 13px;
  }

  textarea {
    min-height: 155px;
    padding: 13px;
    font-size: 13px;
  }

  button {
    min-height: 40px;
    padding: 9px 12px;
    font-size: 12px;
  }

  #scanButton {
    width: 100%;
    min-height: 46px;
    margin-top: 12px;
  }

  #status {
    font-size: 17px;
  }

  #risk {
    font-size: 35px;
  }

  .history-item {
    padding: 12px;
    gap: 9px;
  }

  .history-details strong {
    font-size: 12px;
  }

  .history-details span {
    font-size: 11px;
  }

  #recommendation {
    padding: 13px;
  }
}

/* ACCESSIBILITY */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation: none !important;
    transition: none !important;
  }
}
