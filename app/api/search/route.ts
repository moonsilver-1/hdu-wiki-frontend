import { NextResponse } from "next/server";
import { getSearchIndexData } from "@/lib/content";

export async function GET() {
  const data = getSearchIndexData();
  return NextResponse.json(data);
}
