import RunButton from "@/components/prd/RunButton";
import Timeline from "@/components/prd/Timeline";

type PageParams = {
  params: {
    id: string;
  };
};

export default function PRDDetail({ params }: PageParams) {
  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto", color: "#000" }}>
      <a href="/prd" style={{ color: "#000" }}>
        {"<- Volver"}
      </a>
      <h1 style={{ marginTop: 16, marginBottom: 8 }}>PRD: {params.id}</h1>
      <RunButton prdId={params.id} />
      <Timeline prdId={params.id} />
    </main>
  );
}
