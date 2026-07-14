import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/fetchers/news";

export async function POST() {
  const result = await fetchNews();
  return NextResponse.json(result);
}
