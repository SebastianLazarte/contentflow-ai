"use client";

import { useState } from "react";

type RunApiResponse = {
  error?: string;
  detail?: unknown;
};

function getErrorMessage(payload: RunApiResponse | null, status: number): string {
  if (!payload) {
    return `HTTP ${status}`;
  }

  if (typeof payload.error === "string" && payload.error) {
    return payload.error;
  }

  if (typeof payload.detail === "string" && payload.detail) {
    return payload.detail;
  }

  if (payload.detail && typeof payload.detail === "object") {
    return JSON.stringify(payload.detail);
  }

  return `HTTP ${status}`;
}

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

      let payload: RunApiResponse | null = null;
      try {
        payload = (await res.json()) as RunApiResponse;
      } catch {
        payload = null;
      }

      if (!res.ok) {
        setMsg(`Error: ${getErrorMessage(payload, res.status)}`);
      } else {
        setMsg("Done");
        onComplete?.();
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "failed";
      setMsg(`Network error: ${message}`);
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
