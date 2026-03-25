import { NextResponse } from "next/server";

type RunRequestBody = {
  prdId?: string;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "failed";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as RunRequestBody;
    const prdId = body.prdId;

    if (!prdId) {
      return NextResponse.json({ ok: false, error: "Missing prdId" }, { status: 400 });
    }

    if (process.env.AGENTS_URL && process.env.AGENTS_KEY) {
      try {
        const res = await fetch(`${process.env.AGENTS_URL}/run`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.AGENTS_KEY,
          },
          body: JSON.stringify({ prd_id: prdId }),
        });

        let agents: unknown = null;
        let text = "";

        try {
          agents = await res.json();
        } catch {
          try {
            text = await res.text();
          } catch {
            text = "";
          }
        }

        if (!res.ok) {
          return NextResponse.json(
            {
              ok: false,
              error: "agents_service_error",
              detail: agents ?? (text || `HTTP ${res.status}`),
            },
            { status: res.status }
          );
        }

        return NextResponse.json({ ok: true, agents }, { status: 200 });
      } catch (error: unknown) {
        return NextResponse.json(
          {
            ok: false,
            error: "agents_connection_failed",
            detail: getErrorMessage(error),
          },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ ok: true, run_id: "local-mock", received_prd: prdId }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { ok: false, error: "server_error", detail: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
