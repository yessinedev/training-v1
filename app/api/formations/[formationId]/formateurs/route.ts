import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const formateurSchema = z.object({
  formateur_id: z.number().int().positive(),
});

// GET handler to fetch trainers for a formation
export async function GET(
  request: Request,
  { params }: { params: { formationId: string } }
) {
  try {
    const id = parseInt(params.formationId);

    const formateurs = await prisma.actionFormationFormateur.findMany({
      where: { action_id: id },
      include: {
        formateur: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(formateurs, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch trainers:", error);
    return NextResponse.json(
      { error: "Failed to fetch trainers" },
      { status: 500 }
    );
  }
}

// POST handler to assign a trainer to a formation
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formationId = parseInt(params.id);
    const body = await request.json();
    const validatedData = formateurSchema.parse(body);

    const formateur = await prisma.actionFormationFormateur.create({
      data: {
        action_id: formationId,
        formateur_id: validatedData.formateur_id,
      },
      include: {
        formateur: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(formateur, { status: 201 });
  } catch (error) {
    console.error("Failed to assign trainer:", error);
    return NextResponse.json(
      { error: "Failed to assign trainer" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a trainer from a formation
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formationId = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const formateurId = parseInt(searchParams.get("formateurId") || "");

    if (!formateurId) {
      return NextResponse.json(
        { error: "Trainer ID is required" },
        { status: 400 }
      );
    }

    await prisma.actionFormationFormateur.delete({
      where: {
        action_id_formateur_id: {
          action_id: formationId,
          formateur_id: formateurId,
        },
      },
    });

    return NextResponse.json(
      { message: "Trainer removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to remove trainer:", error);
    return NextResponse.json(
      { error: "Failed to remove trainer" },
      { status: 500 }
    );
  }
}