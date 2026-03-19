import Link from "next/link";
import FormCreate from "@/components/prd/FormCreate";
import { revalidatePath } from "next/cache";

async function getPRDs() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/prd`, { cache: "no-store" });
  const text = await res.text();

  if (!text) {
    return { ok: false, prds: [] };
  }

  try {
    const data = JSON.parse(text);
    return { ok: res.ok && data?.ok !== false, prds: data?.prds ?? [] };
  } catch {
    return { ok: false, prds: [] };
  }
}

async function onCreatedServerAction() {
  "use server";
  revalidatePath("/prd");
}

export default async function PRDPage() {
  const { ok, prds = [] } = await getPRDs();

  return (
    <main style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>PRDs</h1>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Crea product requirement documents y sigue sus versiones desde un solo lugar.
      </p>
      <FormCreate onCreated={onCreatedServerAction as any} />
      <hr style={{ margin: "20px 0", borderColor: "var(--border)" }} />
      {!ok ? (
        <p>No se pudieron cargar los PRDs.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
          {prds.map((p: any) => (
            <li
              key={p.id}
              style={{
                padding: 16,
                borderRadius: 16,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                boxShadow: "var(--shadow)",
              }}
            >
              <Link href={`/prd/${p.id}`} style={{ color: "var(--foreground)", fontWeight: 700, textDecoration: "none" }}>
                {p.title}
              </Link>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
                {new Date(p.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
