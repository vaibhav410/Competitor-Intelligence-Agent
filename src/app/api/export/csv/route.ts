import { NextRequest, NextResponse } from "next/server";
import { exportToCSV } from "@/agents/12-export-agent";
import { CompetitorReport } from "@/lib/types";

export async function POST(req: NextRequest) {
  const report: CompetitorReport = await req.json();
  const csv = exportToCSV(report);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="competitor-report-${report.input.value.replace(/\s+/g, "-").toLowerCase()}.csv"`,
    },
  });
}
