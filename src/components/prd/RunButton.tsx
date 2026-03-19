"use client";
import { useState } from "react";

export default function RunButton({
  prdId,
  onComplete,
}: {
  prdId: string;
  onComplete?: () => void;
}) {
  const [msg, setMsg] = useState("");

  const run = async () => {
    setMsg("Running...");
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prdId }),
      });

      let payload: any = null;
      try {
        payload = await res.json();
      } catch {}

      if (!res.ok) {
        const err = payload?.error || payload?.detail || `HTTP ${res.status}`;
        setMsg(`Error: ${err}`);
      } else {
        setMsg("Done");
        onComplete?.();
      }
    } catch (e: any) {
      setMsg(`Network error: ${e?.message || "failed"}`);
    }
  };

  return (
    <div style={{ margin: "12px 0" }}>
      <button
        onClick={run}
        style={{
          padding: "10px 14px",
          borderRadius: 12,
          border: "1px solid var(--accent)",
          background: "var(--accent)",
          color: "var(--accent-foreground)",
          cursor: "pointer",
        }}
      >
        Run pipeline
      </button>
      {msg && <div><small style={{ color: "var(--muted)" }}>{msg}</small></div>}
    </div>
  );
}
