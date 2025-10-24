"use client";

import { useVersions } from "@/hooks/useVersions";

type TimelineProps = {
  prdId: string;
};

export default function Timeline({ prdId }: TimelineProps) {
  const { versions, loading, reload } = useVersions(prdId);

  return (
    <section style={{ width: "100%", color: "#000" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ marginTop: 16, marginBottom: 8 }}>Timeline</h2>
        <button
          type="button"
          onClick={reload}
          style={{
            fontSize: 12,
            padding: "4px 8px",
            borderRadius: 4,
            border: "1px solid #000",
            background: "#fff",
            color: "#000",
          }}
        >
          Actualizar
        </button>
      </header>
      {loading && versions.length === 0 ? (
        <p style={{ color: "#000" }}>Cargando versiones…</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {versions.map((v: any) => (
            <li
              key={v.id}
              style={{
                marginBottom: 16,
                border: "1px solid #ddd",
                borderRadius: 6,
                padding: 12,
                background: "#fafafa",
                color: "#000",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong>{v.stage}</strong>
                <small>{new Date(v.created_at).toLocaleString()}</small>
              </div>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  background: "#f6f6f6",
                  padding: 8,
                  margin: 0,
                  borderRadius: 4,
                  color: "#000",
                }}
              >
                {typeof v.content === "string" ? v.content : JSON.stringify(v.content, null, 2)}
              </pre>
            </li>
          ))}
          {!loading && versions.length === 0 && (
            <li style={{ color: "#000" }}>Sin versiones aún.</li>
          )}
        </ul>
      )}
    </section>
  );
}
