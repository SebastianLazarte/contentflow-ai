import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { title, body } = await req.json();
  if (!title || !body) return NextResponse.json({ ok:false, error:"Missing fields" }, { status:400 });

  const { data, error } = await serverSupabase()
    .from("prd").insert({ title, body }).select().single();
  if (error) return NextResponse.json({ ok:false, error:error.message }, { status:500 });

  return NextResponse.json({ ok:true, prd:data }, { status:201 });
}
