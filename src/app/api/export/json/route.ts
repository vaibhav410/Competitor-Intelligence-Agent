import { NextRequest, NextResponse } from "next/server";
import { exportToJSON } from "@/agents/12-export-agent";
import { CompetitorReport } from "@/lib/types";

export async function POST(req: NextRequest) {
  const report: CompetitorReport = await req.json();
  const json = exportToJSON(report);

  return new NextResponse(json, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="competitor-report-${report.input.value.replace(/\s+/g, "-").toLowerCase()}.json"`,
    },
  });
}
