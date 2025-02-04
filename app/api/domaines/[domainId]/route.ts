import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { domainId: string } }
) {
  console.log("GET function invoked");
  return NextResponse.json({ message: `Formation ID: ${params.domainId}` }, { status: 200 });
}