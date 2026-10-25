
const messageBox = document.getElementById("message");
const scanButton = document.getElementById("scanButton");
const resultBox = document.getElementById("result");

document.getElementById("sampleSafe")?.addEventListener("click", () => {
  messageBox.value = "Hi, are we still meeting tomorrow at 10 AM? Please let me know.";
});

document.getElementById("sampleSuspicious")?.addEventListener("click", () => {
  messageBox.value = "URGENT! Your bank account will be suspended. Verify your password immediately at http://example.com";
});

document.getElementById("clearButton")?.addEventListener("click", () => {
  messageBox.value = "";
  resultBox.style.display = "none";
});

scanButton?.addEventListener("click", async () => {
  const message = messageBox.value.trim();
  if (!message) {
    alert("Please enter a message to scan.");
    return;
  }

  scanButton.disabled = true;
  scanButton.textContent = "Scanning...";
  resultBox.style.display = "block";
  document.getElementById("status").textContent = "Analyzing message...";
  document.getElementById("risk").textContent = "—";
  document.getElementById("signals").replaceChildren();
  document.getElementById("recommendation").textContent = "";

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Scan failed.");

    document.getElementById("status").textContent = data.status;
    document.getElementById("risk").textContent =
      `${Number(data.risk_score).toFixed(1)}% risk score`;

    const signals = document.getElementById("signals");
    if (data.signals?.length) {
      data.signals.forEach(signal => {
        const li = document.createElement("li");
        li.textContent = signal;
        signals.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "No listed warning signals detected.";
      signals.appendChild(li);
    }
    document.getElementById("recommendation").textContent =
      data.recommendation || "";
  } catch (error) {
    document.getElementById("status").textContent = "Unable to scan";
    document.getElementById("recommendation").textContent = error.message;
  } finally {
    scanButton.disabled = false;
    scanButton.textContent = "Scan message";
  }
});

document.getElementById("copyButton")?.addEventListener("click", async () => {
  const report = [
    document.getElementById("status").textContent,
    document.getElementById("risk").textContent,
    document.getElementById("recommendation").textContent
  ].join("\n");
  try {
    await navigator.clipboard.writeText(report);
    alert("Result copied.");
  } catch {
    alert("Copy is not available in this browser.");
  }
});

document.getElementById("downloadButton")?.addEventListener("click", () => {
  const report = [
    "PhishShift Scan Report",
    "Result: " + document.getElementById("status").textContent,
    "Risk: " + document.getElementById("risk").textContent,
    "Recommendation: " + document.getElementById("recommendation").textContent
  ].join("\n");
  const blob = new Blob([report], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "phishshift-report.txt";
  a.click();
  URL.revokeObjectURL(url);
});
