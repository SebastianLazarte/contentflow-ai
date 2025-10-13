import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await serverSupabase().from("prd").select("*").limit(1);
  if (error) return NextResponse.json({ ok:false, error:error.message }, { status:500 });
  return NextResponse.json({ ok:true, data });
}
