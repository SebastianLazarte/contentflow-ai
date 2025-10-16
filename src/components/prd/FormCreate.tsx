"use client";

import { useState } from "react";

export default function FormCreate({ onCreated }: { onCreated?: () => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("Creando...");
    const res = await fetch("/api/prd", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ title, body })
    });
    const json = await res.json();
    if (res.ok) {
      setMsg("PRD creado ✔️");
      setTitle(""); setBody("");
      onCreated?.();          // notifica al padre (server) que refresque
    } else {
      setMsg(`Error: ${json.error ?? "desconocido"}`);
    }
  };

  return (
    <form onSubmit={submit} style={{ display:"grid", gap:8, marginTop:16 }}>
      <input
        placeholder="Título del PRD"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Cuerpo / objetivos / alcance / KPIs"
        value={body}
        onChange={(e)=>setBody(e.target.value)}
        rows={6}
        required
      />
      <button type="submit">Crear PRD</button>
      {msg && <small>{msg}</small>}
    </form>
  );
}
