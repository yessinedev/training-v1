import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { formationId: string } }
) {
  console.log("GET function invoked");
  return NextResponse.json({ message: `Formation ID: ${params.formationId}` }, { status: 200 });
}