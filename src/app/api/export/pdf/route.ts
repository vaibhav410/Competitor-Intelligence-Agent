import { NextRequest, NextResponse } from "next/server";
import { generatePDFHTML } from "@/agents/12-export-agent";
import { CompetitorReport } from "@/lib/types";

export async function POST(req: NextRequest) {
  const report: CompetitorReport = await req.json();
  const html = generatePDFHTML(report);

  // Return the HTML — the client will use window.print() to PDF
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
