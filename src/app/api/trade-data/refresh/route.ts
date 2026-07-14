import { NextResponse } from "next/server";
import { fetchTradeData } from "@/lib/fetchers/tradeData";

export async function POST() {
  const result = await fetchTradeData();
  return NextResponse.json(result);
}
