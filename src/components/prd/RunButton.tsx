"use client";
import { useState } from "react";

export default function RunButton({ prdId }: { prdId: string }) {
  const [msg, setMsg] = useState("");

  const run = async () => {
    setMsg("Ejecutando...");
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ prdId })
      });

      // Intenta parsear JSON; si falla, cae a texto
      let payload: any = null;
      let text = "";
      try {
        payload = await res.json();
      } catch {
        try { text = await res.text(); } catch {}
      }

      if (!res.ok) {
        const err = (payload && (payload.error || payload.message)) || text || `HTTP ${res.status}`;
        setMsg(`Error: ${err}`);
        return;
      }

      const runId = (payload && (payload.run_id || payload.agents?.run_id)) || "ok";
      setMsg(`Listo: ${runId}`);
    } catch (e: any) {
      setMsg(`Error de red: ${e?.message || "falló la solicitud"}`);
    }
  };

  return (
    <div style={{ margin:"12px 0" }}>
      <button onClick={run}>Ejecutar pipeline</button>
      {msg && <div><small>{msg}</small></div>}
    </div>
  );
}
