import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase"; // usa tu cliente

// Crear un nuevo PRD
export async function POST(request: Request) {
  const body = await request.json();
  const { title, body: description } = body;

  if (!title || !description) {
    return NextResponse.json({ error: "Title and body required" }, { status: 400 });
  }

  const { data, error } = await serverSupabase()
    .from("prd")
    .insert([{ title, body: description }])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, prd: data[0] });
}

// Listar todos los PRDs
export async function GET() {
  const { data, error } = await serverSupabase()
    .from("prd")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, prds: data });
}
