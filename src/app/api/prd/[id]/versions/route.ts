import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase";

export async function GET(req: Request, context: { params: { id?: string } }) {
  const { params } = context; // Extraer params del contexto
  const id = params?.id; // Asegurarse de que params.id esté definido

  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing or invalid ID" }, { status: 400 });
  }

  try {
    const { data, error } = await serverSupabase()
      .from("content_version")
      .select("*")
      .eq("prd_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, versions: data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}