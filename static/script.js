
"use strict";

const $ = (id) => document.getElementById(id);

const messageInput = $("message");
const scanButton = $("scanButton");
const scanButtonText = $("scanButtonText");
const resultSection = $("result");

let latestReport = null;

const samples = {
  safe: "Hi Alex, our meeting is scheduled for tomorrow at 10 AM. Please review the agenda before we meet. Thank you.",
  suspicious: "Your account needs attention. Please review your account activity and confirm that your contact details are up to date.",
  phishing: "URGENT! Your bank account will be suspended today. Verify your identity immediately using this link and enter your password to restore access."
};

function escapeText(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function updateCharacterCount() {
  $("charCount").textContent =
    `${messageInput.value.length.toLocaleString()} / 20,000 characters`;
}

function showError(message) {
  const error = $("errorMessage");
  error.textContent = message;
  error.hidden = false;
}

function hideError() {
  $("errorMessage").hidden = true;
  $("errorMessage").textContent = "";
}

function normalizePrediction(value) {
  const label = String(value ?? "").trim().toLowerCase();

  if (/phishing|^spam$|malicious|fraud/.test(label)) {
    return "phishing";
  }

  if (/not[\s_-]*phishing|non[\s_-]*phishing|legitimate|^safe$|^ham$|^0$|^false$/.test(label)) {
    return "safe";
  }

  return "unknown";
}

function findSignals(text) {
  const signals = [];
  const checks = [
    {
      pattern: /\b(urgent|immediately|act now|expires today|final warning|within \d+ hours?)\b/i,
      title: "Urgency or pressure",
      detail: "The message uses urgent language that may pressure the recipient to act quickly."
    },
    {
      pattern: /\b(password|passcode|otp|one.time password|pin number|security code)\b/i,
      title: "Credential or code reference",
      detail: "The message refers to passwords, access codes or other sensitive authentication details."
    },
    {
      pattern: /\b(verify your account|confirm your identity|account suspended|account blocked|account will be closed)\b/i,
      title: "Account verification or threat",
      detail: "The message asks for verification or threatens an account restriction."
    },
    {
      pattern: /\b(click here|login now|log in immediately|reset your password|update your details)\b/i,
      title: "Action request",
      detail: "The message encourages a login, password reset or change to personal details."
    },
    {
      pattern: /https?:\/\/|www\./i,
      title: "Web link present",
      detail: "A URL appears in the message. Check the actual domain carefully before opening it."
    },
    {
      pattern: /\b(prize|winner|claim your reward|free gift|you have won|lottery)\b/i,
      title: "Prize or reward language",
      detail: "The message mentions a prize or reward, which can sometimes be used as bait."
    },
    {
      pattern: /\b(bank details|credit card|social security|personal information|payment details)\b/i,
      title: "Sensitive information request",
      detail: "The message refers to financial or personal information."
    }
  ];

  for (const check of checks) {
    if (check.pattern.test(text)) {
      signals.push({
        title: check.title,
        detail: check.detail
      });
    }
  }

  return signals;
}

function getRisk(prediction, confidence) {
  // The API confidence is assumed to be the confidence of its
  // predicted class, not an independently calibrated risk score.
  if (prediction === "phishing") return Math.round(confidence * 100);
  if (prediction === "safe") return Math.round((1 - confidence) * 100);
  return null;
}

function getSeverity(prediction, risk) {
  if (prediction === "phishing") return "danger";
  if (prediction === "safe" && risk !== null && risk < 35) return "safe";
  return "warning";
}

function renderSignals(signals) {
  const list = $("signals");
  list.replaceChildren();

  $("noSignals").hidden = signals.length > 0;

  signals.forEach((signal) => {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    const detail = document.createElement("span");

    title.textContent = signal.title;
    detail.textContent = ` — ${signal.detail}`;

    item.append(title, detail);
    list.appendChild(item);
  });
}

function displayResult(report) {
  latestReport = report;

  const severity = getSeverity(report.prediction, report.risk);
  const badge = $("resultBadge");
  const verdict = $("status");
  const bar = $("riskBar");

  badge.className = `verdict-badge ${severity}`;
  badge.textContent = report.prediction === "phishing"
    ? "Potential phishing"
    : report.prediction === "safe"
      ? "Model classified as non-phishing"
      : "Unrecognized model label";

  verdict.className = severity;
  verdict.textContent = report.prediction === "phishing"
    ? "Potential phishing detected"
    : report.prediction === "safe"
      ? "Classified as non-phishing"
      : `Model result: ${report.rawPrediction}`;

  $("risk").textContent = report.risk === null
    ? "N/A"
    : report.risk;

  bar.style.width = report.risk === null ? "0%" : `${report.risk}%`;
  bar.className = `risk-fill ${severity}`;

  $("riskDescription").textContent = report.risk === null
    ? "A risk score cannot be calculated for this model label."
    : "Estimated from the model's class confidence. This is not a calibrated probability of danger.";

  $("recommendation").textContent = report.prediction === "phishing"
    ? "Do not click links or share information. Verify the message through the organization's official website or phone number."
    : report.prediction === "safe"
      ? "The model classified this message as non-phishing. This does not prove that it is legitimate; verify unexpected requests independently."
      : "The model returned an unfamiliar label. Review the API response and confirm your model's class names.";

  renderSignals(report.signals);

  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function scanMessage() {
  const text = messageInput.value.trim();

  hideError();

  if (!text) {
    showError("Please enter a message before starting the scan.");
    messageInput.focus();
    return;
  }

  scanButton.disabled = true;
  scanButtonText.textContent = "Analyzing message…";
  scanButton.querySelector(".button-arrow").textContent = "…";

  try {
    // Keep this endpoint aligned with your existing Flask app.
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error("The server returned an invalid response. Check your Flask logs.");
    }

    if (!response.ok) {
      throw new Error(data.error || data.message ||
        `The server returned HTTP ${response.status}.`);
    }

    if (!data || data.prediction === undefined) {
      throw new Error("The API response is missing the prediction field.");
    }

    const prediction = normalizePrediction(data.prediction);

    let confidence = Number(data.confidence_score);

    // Accept confidence in either 0–1 or 0–100 format.
    if (Number.isFinite(confidence) && confidence > 1 && confidence <= 100) {
      confidence /= 100;
    }

    if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
      throw new Error("The API returned an invalid confidence score.");
    }

    const report = {
      date: new Date().toISOString(),
      prediction,
      rawPrediction: String(data.prediction),
      confidence,
      risk: getRisk(prediction, confidence),
      signals: findSignals(text),
      preview: text.slice(0, 180),
      text
    };

    displayResult(report);
    saveHistory(report);

  } catch (error) {
    showError(
      error.message.includes("Failed to fetch")
        ? "Could not connect to the scanner. Make sure your Flask server is running and /predict is available."
        : error.message
    );
  } finally {
    scanButton.disabled = false;
    scanButtonText.textContent = "Analyze message";
    scanButton.querySelector(".button-arrow").textContent = "→";
  }
}

function readHistory() {
  try {
    const value = JSON.parse(localStorage.getItem("phishshift_history") || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveHistory(report) {
  // Do not persist the original message text.
  const entry = {
    date: report.date,
    prediction: report.prediction,
    rawPrediction: report.rawPrediction,
    risk: report.risk,
    preview: report.preview
  };

  try {
    const history = [entry, ...readHistory()].slice(0, 8);
    localStorage.setItem("phishshift_history", JSON.stringify(history));
    renderHistory();
  } catch {
    // Scanning still works if browser storage is unavailable.
  }
}

function renderHistory() {
  const container = $("historyList");
  container.replaceChildren();

  const history = readHistory();

  if (!history.length) {
    const empty = document.createElement("p");
    empty.className = "empty-history";
    empty.textContent = "Your completed scans will appear here.";
    container.appendChild(empty);
    return;
  }

  history.forEach((item) => {
    const severity = getSeverity(item.prediction, item.risk);
    const row = document.createElement("div");
    row.className = "history-item";

    const symbol = document.createElement("div");
    symbol.className = `history-symbol ${severity}`;
    symbol.textContent = severity === "safe" ? "✓"
      : severity === "danger" ? "!" : "?";

    const copy = document.createElement("div");
    copy.className = "history-copy";

    const title = document.createElement("strong");
    title.textContent = item.prediction === "phishing"
      ? "Potential phishing"
      : item.prediction === "safe"
        ? "Classified as non-phishing"
        : `Model result: ${item.rawPrediction || "Unknown"}`;

    const preview = document.createElement("p");
    preview.textContent = item.preview || "Message preview unavailable";

    copy.append(title, preview);

    const time = document.createElement("span");
    time.className = "history-time";

    const date = new Date(item.date);
    time.textContent = Number.isNaN(date.getTime())
      ? ""
      : date.toLocaleString();

    row.append(symbol, copy, time);
    container.appendChild(row);
  });
}

function createReportText(report) {
  return [
    "PHISHSHIFT — MESSAGE SECURITY REPORT",
    "=====================================",
    `Date: ${new Date(report.date).toLocaleString()}`,
    `Model verdict: ${report.rawPrediction}`,
    `Estimated phishing risk: ${report.risk === null ? "Unavailable" : `${report.risk}/100`}`,
    `Model confidence: ${(report.confidence * 100).toFixed(1)}%`,
    "",
    "WARNING INDICATORS",
    ...(report.signals.length
      ? report.signals.map((signal) => `- ${signal.title}: ${signal.detail}`)
      : ["No common warning patterns were identified."]),
    "",
    "IMPORTANT",
    "This automated prediction is not a guarantee of safety or danger.",
    "Verify suspicious requests through official channels."
  ].join("\n");
}

$("scanButton").addEventListener("click", scanMessage);

messageInput.addEventListener("input", updateCharacterCount);

$("clearButton").addEventListener("click", () => {
  messageInput.value = "";
  updateCharacterCount();
  hideError();
  messageInput.focus();
});

$("sampleSafe").addEventListener("click", () => {
  messageInput.value = samples.safe;
  updateCharacterCount();
  hideError();
});

$("sampleSuspicious").addEventListener("click", () => {
  messageInput.value = samples.suspicious;
  updateCharacterCount();
  hideError();
});

$("samplePhishing").addEventListener("click", () => {
  messageInput.value = samples.phishing;
  updateCharacterCount();
  hideError();
});

$("copyButton").addEventListener("click", async () => {
  if (!latestReport) return;

  try {
    await navigator.clipboard.writeText(createReportText(latestReport));
    $("copyButton").textContent = "✓ Copied";
    setTimeout(() => { $("copyButton").textContent = "▣ Copy report"; }, 1800);
  } catch {
    showError("Unable to copy automatically. Please use Download report instead.");
  }
});

$("downloadButton").addEventListener("click", () => {
  if (!latestReport) return;

  const blob = new Blob([createReportText(latestReport)], {
    type: "text/plain;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "phishshift-report.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

$("clearHistoryButton").addEventListener("click", () => {
  try {
    localStorage.removeItem("phishshift_history");
  } catch {
    showError("Browser storage could not be cleared.");
    return;
  }
  renderHistory();
});

updateCharacterCount();
renderHistory();
