import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase";

type RouteContext = {
  params: Promise<{
    id?: string;
  }>;
};

export async function GET(req: Request, context: RouteContext) {
  const { id } = await context.params;

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
  } catch {
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}