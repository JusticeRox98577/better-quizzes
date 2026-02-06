"use client";
import { useState } from "react";

export default function TeacherPage() {
  const [canvasBaseUrl, setCanvasBaseUrl] = useState("https://k12.instructure.com");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");

  async function connect() {
    setStatus("Connecting...");
    const res = await fetch("/api/connect", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ canvasBaseUrl, token }) });
    const data = await res.json();
    if (!res.ok) return setStatus(data.error ?? "Failed");
    setStatus(`Connected as ${data.user.name}`);
  }

  return (
    <main style={{ padding: 24, maxWidth: 800 }}>
      <h1>Teacher</h1>
      <label style={{ display: "block", marginTop: 8 }}>
        Canvas Base URL
        <input value={canvasBaseUrl} onChange={(e) => setCanvasBaseUrl(e.target.value)} style={{ width: "100%", padding: 10 }} />
      </label>
      <label style={{ display: "block", marginTop: 8 }}>
        Canvas Token
        <input value={token} onChange={(e) => setToken(e.target.value)} style={{ width: "100%", padding: 10 }} />
      </label>
      <button onClick={connect} style={{ marginTop: 10, padding: 10, width: "100%" }}>Connect</button>
      <p style={{ opacity: 0.85 }}>{status}</p>
    </main>
  );
}
