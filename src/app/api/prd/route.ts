import { NextResponse } from "next/server";
import { adminSupabase,serverSupabase } from "@/lib/supabase"; // usamos el de servicio

export async function POST(req: Request) {
  const { title, body } = await req.json();
  if (!title || !body) return NextResponse.json({ ok: false, error: "Missing title/body" }, { status: 400 });

  const { data, error } = await adminSupabase().from("prd").insert({ title, body }).select().single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, prd: data }, { status: 201 });
}

export async function GET() {
  const { data, error } = await serverSupabase()
    .from("prd")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ ok:false, error:error.message }, { status:500 });
  return NextResponse.json({ ok:true, prds:data });
}