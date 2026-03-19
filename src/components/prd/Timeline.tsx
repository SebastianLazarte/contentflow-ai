"use client";

import { useVersions } from "@/hooks/useVersions";

type TimelineProps = {
  prdId: string;
};

export default function Timeline({ prdId }: TimelineProps) {
  const { versions, loading, reload } = useVersions(prdId);

  return (
    <section style={{ width: "100%" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 style={{ marginTop: 16, marginBottom: 8 }}>Timeline</h2>
        <button
          type="button"
          onClick={reload}
          style={{
            fontSize: 12,
            padding: "6px 10px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--foreground)",
            cursor: "pointer",
          }}
        >
          Actualizar
        </button>
      </header>
      {loading && versions.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>Cargando versiones...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
          {versions.map((v: any) => (
            <li
              key={v.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 14,
                background: "var(--surface)",
                color: "var(--foreground)",
                boxShadow: "var(--shadow)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, gap: 12 }}>
                <strong>{v.stage}</strong>
                <small style={{ color: "var(--muted)" }}>{new Date(v.created_at).toLocaleString()}</small>
              </div>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  background: "var(--surface-muted)",
                  padding: 10,
                  margin: 0,
                  borderRadius: 12,
                  color: "var(--foreground)",
                }}
              >
                {typeof v.content === "string" ? v.content : JSON.stringify(v.content, null, 2)}
              </pre>
            </li>
          ))}
          {!loading && versions.length === 0 && <li style={{ color: "var(--muted)" }}>Sin versiones aun.</li>}
        </ul>
      )}
    </section>
  );
}
