import RunButton from "@/components/prd/RunButton";

async function getVersions(id: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/prd/${id}/versions`, { cache: "no-store" });
  return res.json();
}

export default async function PRDDetail({ params }: { params: { id: string } }) {
  const { ok, versions = [] } = await getVersions(params.id);

  return (
    <main style={{ padding:24, maxWidth:800, margin:"0 auto" }}>
      <a href="/prd">← Volver</a>
      <h1>PRD: {params.id}</h1>
      <RunButton prdId={params.id} />
      <h2 style={{ marginTop:16 }}>Timeline</h2>
      {!ok ? <p>Error cargando versiones</p> : (
        <ul>
          {versions.map((v: any) => (
            <li key={v.id} style={{ marginBottom:16 }}>
              <strong>{v.stage}</strong>{" "}
              <small>({new Date(v.created_at).toLocaleString()})</small>
              <pre style={{ whiteSpace:"pre-wrap", background:"#f6f6f6",color: "#000", padding:8 }}>{v.content}</pre>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
