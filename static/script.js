
const messageBox = document.getElementById("message");
const scanButton = document.getElementById("scanButton");
const resultBox = document.getElementById("result");

const $ = (id) => document.getElementById(id);

const HISTORY_KEY = "phishshift_scan_history_v1";
let lastReport = null;

const samples = {
  safe: "Hi, are we still meeting tomorrow at 10 AM? Please let me know.",
  suspicious:
    "URGENT! Your bank account will be suspended. Verify your password immediately at http://example.com",
  phishing:
    "URGENT: Your account will be blocked today! Verify your password and claim your prize immediately at http://example.com"
};

function setMessage(text) {
  messageBox.value = text;
  messageBox.dispatchEvent(new Event("input", { bubbles: true }));
  messageBox.focus();
}

function showError(message) {
  const error = $("errorMessage");

  if (error) {
    error.textContent = message;
    error.hidden = false;
  } else {
    alert(message);
  }
}

function clearError() {
  const error = $("errorMessage");
  if (error) {
    error.textContent = "";
    error.hidden = true;
  }
}

function getHistory() {
  try {
    const items = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function saveHistory(item) {
  try {
    const history = getHistory();
    history.unshift(item);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10)));
    renderHistory();
  } catch {
    // Scanning should continue if browser storage is unavailable.
  }
}

function renderHistory() {
  const list = $("historyList");
  if (!list) return;

  list.replaceChildren();

  const history = getHistory();
  const empty = $("emptyHistory");

  if (!history.length) {
    const message = document.createElement("p");
    message.className = "empty-history";
    message.textContent = "No recent scans yet. Scan a message to see results here.";
    list.appendChild(message);
    return;
  }

  history.forEach((item) => {
    const row = document.createElement("div");
    row.className = "history-item";

    const details = document.createElement("div");
    details.className = "history-details";

    const title = document.createElement("strong");
    title.textContent = item.status || "Scan complete";

    const time = document.createElement("span");
    time.textContent = new Date(item.time).toLocaleString();

    details.append(title, time);

    const risk = document.createElement("span");
    risk.className = "history-risk";
    risk.textContent = Number.isFinite(item.risk)
      ? `${item.risk.toFixed(1)}%`
      : "N/A";

    row.append(details, risk);
    list.appendChild(row);
  });
}

function updateCharacterCount() {
  const counter = $("charCount");
  if (counter) {
    counter.textContent = `${messageBox.value.length} / 20000`;
  }
}

function setRiskDisplay(score) {
  const risk = $("risk");
  const bar = $("riskBar");
  const description = $("riskDescription");

  if (risk) {
    risk.textContent = Number.isFinite(score)
      ? `${score.toFixed(1)}%`
      : "N/A";
  }

  if (bar) {
    bar.style.width = `${Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : 0}%`;
  }

  if (description) {
    if (!Number.isFinite(score)) {
      description.textContent = "Risk score was not provided by the model.";
    } else if (score >= 70) {
      description.textContent = "High estimated risk. Verify independently.";
    } else if (score >= 35) {
      description.textContent = "Some warning signs may need attention.";
    } else {
      description.textContent = "Lower estimated risk does not guarantee safety.";
    }
  }
}

function displaySignals(signals) {
  const list = $("signals");
  const empty = $("noSignals");

  if (!list) return;

  list.replaceChildren();

  const items = Array.isArray(signals) ? signals : [];

  items.forEach((signal) => {
    const li = document.createElement("li");
    li.textContent = String(signal);
    list.appendChild(li);
  });

  if (empty) {
    empty.hidden = items.length > 0;
  }

  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "No additional warning signals were reported.";
    list.appendChild(li);
  }
}

function showResult(data, shouldSave = true) {
  const status = String(data.status || "Analysis complete");
  const rawRisk = Number(data.risk_score);
  const risk = Number.isFinite(rawRisk)
    ? Math.min(100, Math.max(0, rawRisk))
    : NaN;

  const signals = Array.isArray(data.signals) ? data.signals : [];
  const recommendation = String(
    data.recommendation || "Verify unexpected requests through official channels."
  );

  if (resultBox) resultBox.hidden = false;

  $("status").textContent = status;
  $("recommendation").textContent = recommendation;

  setRiskDisplay(risk);
  displaySignals(signals);

  const badge = $("resultBadge");
  if (badge) {
    badge.textContent = status;
    badge.className = "result-badge";

    const normalized = status.toLowerCase();

    if (normalized.includes("phish")) {
      badge.classList.add("danger");
    } else if (
      normalized.includes("suspicious") ||
      normalized.includes("spam")
    ) {
      badge.classList.add("warning");
    } else if (normalized.includes("safe")) {
      badge.classList.add("safe");
    }
  }

  lastReport = {
    status,
    risk,
    signals,
    recommendation,
    time: new Date().toISOString()
  };

  if (shouldSave) {
    // Intentionally save the result metadata only, never the message itself.
    saveHistory({
      status,
      risk,
      time: lastReport.time
    });
  }

  resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

$("sampleSafe")?.addEventListener("click", () => setMessage(samples.safe));
$("sampleSuspicious")?.addEventListener("click", () => setMessage(samples.suspicious));
$("samplePhishing")?.addEventListener("click", () => setMessage(samples.phishing));

messageBox?.addEventListener("input", () => {
  updateCharacterCount();
  clearError();
});

$("clearButton")?.addEventListener("click", () => {
  setMessage("");
  clearError();

  if (resultBox) resultBox.hidden = true;

  lastReport = null;
  messageBox.focus();
});

scanButton?.addEventListener("click", async () => {
  const message = messageBox.value.trim();

  clearError();

  if (!message) {
    showError("Please enter a message to scan.");
    messageBox.focus();
    return;
  }

  if (message.length > 20000) {
    showError("Please shorten your message before scanning.");
    return;
  }

  scanButton.disabled = true;
  scanButton.textContent = "Scanning...";

  if (resultBox) resultBox.hidden = false;

  $("status").textContent = "Analyzing message...";
  $("recommendation").textContent = "Please wait for the model prediction.";
  $("risk").textContent = "—";
  $("signals")?.replaceChildren();

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `Scan failed (${response.status}).`);
    }

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.status) {
      throw new Error("The server response did not contain a prediction status.");
    }

    showResult(data);
  } catch (error) {
    $("status").textContent = "Unable to scan";
    $("recommendation").textContent =
      error.message || "Something went wrong. Please try again.";

    showError(
      "Could not complete the scan. Check your connection and try again."
    );
  } finally {
    scanButton.disabled = false;
    scanButton.textContent = "⌕ Scan Message";
  }
});

$("copyButton")?.addEventListener("click", async () => {
  if (!lastReport) {
    showError("Scan a message before copying a report.");
    return;
  }

  const report = [
    "PhishShift Scan Report",
    `Result: ${lastReport.status}`,
    `Risk score: ${Number.isFinite(lastReport.risk) ? `${lastReport.risk.toFixed(1)}%` : "Not provided"}`,
    `Warning signals: ${lastReport.signals.join("; ") || "None reported"}`,
    `Recommendation: ${lastReport.recommendation}`,
    `Time: ${lastReport.time}`
  ].join("\n");

  try {
    await navigator.clipboard.writeText(report);
    $("copyButton").textContent = "Copied!";
    setTimeout(() => {
      $("copyButton").textContent = "Copy Report";
    }, 1500);
  } catch {
    showError("Copy is unavailable. Please use Download Report instead.");
  }
});

$("downloadButton")?.addEventListener("click", () => {
  if (!lastReport) {
    showError("Scan a message before downloading a report.");
    return;
  }

  const report = [
    "PhishShift Scan Report",
    `Result: ${lastReport.status}`,
    `Risk score: ${Number.isFinite(lastReport.risk) ? `${lastReport.risk.toFixed(1)}%` : "Not provided"}`,
    "",
    "Warning signals:",
    ...(lastReport.signals.length
      ? lastReport.signals.map((signal) => `- ${signal}`)
      : ["- None reported"]),
    "",
    `Recommendation: ${lastReport.recommendation}`,
    `Time: ${lastReport.time}`,
    "",
    "Automated predictions are not guarantees."
  ].join("\n");

  const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "phishshift-report.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

$("clearHistoryButton")?.addEventListener("click", () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Storage may be disabled in the browser.
  }

  renderHistory();
});

updateCharacterCount();
renderHistory();
