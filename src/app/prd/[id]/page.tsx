import Link from "next/link";
import RunButton from "@/components/prd/RunButton";
import Timeline from "@/components/prd/Timeline";

type PageParams = {
  params: {
    id: string;
  };
};

export default function PRDDetail({ params }: PageParams) {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto" }}>
      <Link href="/prd" style={{ color: "var(--accent)", textDecoration: "none" }}>
        {"<- Volver"}
      </Link>
      <h1 style={{ marginTop: 16, marginBottom: 8 }}>PRD: {params.id}</h1>
      <RunButton prdId={params.id} />
      <Timeline prdId={params.id} />
    </main>
  );
}