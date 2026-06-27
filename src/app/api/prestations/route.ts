import { NextRequest } from "next/server";
import { PRESTATIONS_DEMO } from "@/lib/demo-data";

export async function GET(_req: NextRequest) {
  return Response.json(PRESTATIONS_DEMO);
}
