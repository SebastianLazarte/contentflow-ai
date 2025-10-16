import Link from "next/link";
import FormCreate from "@/components/prd/FormCreate";
import { revalidatePath } from "next/cache"; // Next 14+ (App Router)

// Utilidad server-side para traer PRDs
async function getPRDs() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/prd`, { cache: "no-store" });
  return res.json();
}

// Acción para refrescar la página tras crear
async function onCreatedServerAction() {
  "use server";
  // Revalida la ruta actual (forzamos a leer de /api/prd otra vez)
  revalidatePath("/prd");
}

export default async function PRDPage() {
  const { ok, prds = [] } = await getPRDs();

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1>PRDs</h1>
      {/* Pasamos una server action envuelta para que el client la llame */}
      <FormCreate onCreated={onCreatedServerAction as any} />
      <hr style={{ margin: "16px 0" }} />
      {!ok ? (
        <p>Error cargando PRDs</p>
      ) : (
        <ul>
          {prds.map((p: any) => (
            <li key={p.id} style={{ marginBottom: 8 }}>
              <Link href={`/prd/${p.id}`}>{p.title}</Link>
              <div style={{ fontSize: 12, color: "#666" }}>
                {new Date(p.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
