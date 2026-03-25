import Link from "next/link";
import { revalidatePath } from "next/cache";
import FormCreate from "@/components/prd/FormCreate";
import { serverSupabase } from "@/lib/supabase";

type PrdSummary = {
  id: string;
  title: string;
  created_at: string;
};

type PrdLoadResult = {
  ok: boolean;
  prds: PrdSummary[];
  error?: string;
};

async function getPRDs(): Promise<PrdLoadResult> {
  try {
    const { data, error } = await serverSupabase()
      .from("prd")
      .select("id,title,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return { ok: false, prds: [], error: error.message };
    }

    return { ok: true, prds: (data ?? []) as PrdSummary[] };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, prds: [], error: message };
  }
}

async function onCreatedServerAction() {
  "use server";
  revalidatePath("/prd");
}

export default async function PRDPage() {
  const { ok, prds, error } = await getPRDs();

  return (
    <main style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>PRDs</h1>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Crea product requirement documents y sigue sus versiones desde un solo lugar.
      </p>
      <FormCreate onCreated={onCreatedServerAction} />
      <hr style={{ margin: "20px 0", borderColor: "var(--border)" }} />
      {!ok ? (
        <div style={{ color: "var(--muted)" }}>
          <p style={{ marginBottom: 6 }}>No pudimos cargar los PRDs.</p>
          {error ? <small>Detalle: {error}</small> : null}
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
          {prds.map((prd) => (
            <li
              key={prd.id}
              style={{
                padding: 16,
                borderRadius: 16,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                boxShadow: "var(--shadow)",
              }}
            >
              <Link href={`/prd/${prd.id}`} style={{ color: "var(--foreground)", fontWeight: 700, textDecoration: "none" }}>
                {prd.title}
              </Link>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
                {new Date(prd.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
