import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET handler to fetch a specific formation with essential data
export async function GET(
  request: Request,
  { params }: { params: Promise<{ formationId: string }> }
) {
    const {formationId} = await params
  try {
    
    // Fetch only the essential formation data without any relations
    const formation = await prisma.actionFormation.findUnique({
      where: { action_id: parseInt(formationId) },
      include: {
        theme: {
          include: {
            domaine: true,
          },
        },
        formateurs: {
          include: {
            formateur: {
              include: {
                user: true,
              },
            },
          },
        },
        participants: {
          include: {
            participant: {
              include: {
                attestations: true,
                actions: true
              }
            }
          }
        }
      },
    });

    if (!formation) {
      return NextResponse.json(
        { error: "Formation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(formation, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch formation:", error);
    return NextResponse.json(
      { error: "Failed to fetch formation" },
      { status: 500 }
    );
  }
}