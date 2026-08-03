import { NextResponse } from "next/server";
import { env } from "@/lib/env";

/**
 * Health check for deployment and uptime monitoring.
 *
 * Reports only non-sensitive operational values. It must never expose secrets,
 * connection strings, or user data.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      environment: env.APP_ENV,
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: { "cache-control": "no-store" },
    },
  );
}
