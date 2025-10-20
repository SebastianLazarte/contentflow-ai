import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prdId } = await req.json().catch(() => ({}));
    if (!prdId) {
      return NextResponse.json({ ok:false, error:"Missing prdId" }, { status:400 });
    }

    // Si tienes AGENTS_URL/KEY definidos, intenta llamar al servicio externo
    if (process.env.AGENTS_URL && process.env.AGENTS_KEY) {
      try {
        const res = await fetch(`${process.env.AGENTS_URL}/run`, {
          method: "POST",
          headers: {
            "Content-Type":"application/json",
            "x-api-key": process.env.AGENTS_KEY!,
          },
          body: JSON.stringify({ prd_id: prdId }),
        });

        // Fuerza devolver JSON aunque el servicio externo falle raro
        let agents: any = null; let text = "";
        try { agents = await res.json(); } catch { try { text = await res.text(); } catch {} }

        if (!res.ok) {
          return NextResponse.json(
            { ok:false, error:"agents_service_error", detail: agents || text || `HTTP ${res.status}` },
            { status:502 }
          );
        }

        return NextResponse.json({ ok:true, agents }, { status:200 });
      } catch (e: any) {
        return NextResponse.json({ ok:false, error:"agents_connection_failed", detail: e?.message }, { status:502 });
      }
    }

    // Mock local SIEMPRE devuelve JSON
    return NextResponse.json({ ok:true, run_id:"local-mock", received_prd: prdId }, { status:200 });

  } catch (e: any) {
    return NextResponse.json({ ok:false, error:"server_error", detail: e?.message }, { status:500 });
  }
}
