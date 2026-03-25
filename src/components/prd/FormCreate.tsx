"use client";

import { useState } from "react";

const fieldStyle = {
  padding: 10,
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--foreground)",
} as const;

const buttonStyle = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid var(--accent)",
  background: "var(--accent)",
  color: "var(--accent-foreground)",
  width: "fit-content",
  cursor: "pointer",
} as const;

export default function FormCreate({ onCreated }: { onCreated?: () => void | Promise<void> }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("Creando...");
    const res = await fetch("/api/prd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    const json = await res.json();
    if (res.ok) {
      setMsg("PRD creado");
      setTitle("");
      setBody("");
      await onCreated?.();
    } else {
      setMsg(`Error: ${json.error ?? "desconocido"}`);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 10, marginTop: 16 }}>
      <input
        placeholder="Titulo del PRD"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={fieldStyle}
      />
      <textarea
        placeholder="Cuerpo / objetivos / alcance / KPIs"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
        required
        style={fieldStyle}
      />
      <button type="submit" style={buttonStyle}>Crear PRD</button>
      {msg && <small style={{ color: "var(--muted)" }}>{msg}</small>}
    </form>
  );
}
