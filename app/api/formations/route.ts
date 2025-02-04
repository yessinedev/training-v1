import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const formationSchema = z.object({
  type_action: z.string().min(1),
  theme_id: z.number().min(1),
  date_debut: z.string(),
  date_fin: z.string(),
  duree_jours: z.number().min(1),
  duree_heures: z.number().min(1),
  lieu: z.string().min(1),
  nb_participants_prevu: z.number().min(1),
  formateur_id: z.number().optional(),
});

// GET handler to fetch all formations
export async function GET() {
  try {
    const formations = await prisma.actionFormation.findMany({
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
      },
    });
    return NextResponse.json(formations, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch formations:", error);
    return NextResponse.json(
      { error: "Failed to fetch formations" },
      { status: 500 }
    );
  }
}

// POST handler to create a new formation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = formationSchema.parse(body);

    const formation = await prisma.actionFormation.create({
      data: {
        type_action: validatedData.type_action,
        theme_id: validatedData.theme_id,
        date_debut: new Date(validatedData.date_debut),
        date_fin: new Date(validatedData.date_fin),
        duree_jours: validatedData.duree_jours,
        duree_heures: validatedData.duree_heures,
        lieu: validatedData.lieu,
        nb_participants_prevu: validatedData.nb_participants_prevu,
        formateurs: validatedData.formateur_id ? {
          create: {
            formateur_id: validatedData.formateur_id,
          },
        } : undefined,
      },
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
      },
    });

    return NextResponse.json(formation, { status: 201 });
  } catch (error) {
    console.error("Failed to create formation:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create formation" },
      { status: 500 }
    );
  }
}

// PUT handler to update a formation
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { action_id, ...updateData } = body;

    if (!action_id) {
      return NextResponse.json(
        { error: "Formation ID is required" },
        { status: 400 }
      );
    }

    const validatedData = formationSchema.parse(updateData);

    // First, delete existing formateur relationship if any
    if (validatedData.formateur_id) {
      await prisma.actionFormationFormateur.deleteMany({
        where: { action_id: parseInt(action_id.toString()) },
      });
    }

    const updatedFormation = await prisma.actionFormation.update({
      where: { action_id: parseInt(action_id.toString()) },
      data: {
        type_action: validatedData.type_action,
        theme_id: validatedData.theme_id,
        date_debut: new Date(validatedData.date_debut),
        date_fin: new Date(validatedData.date_fin),
        duree_jours: validatedData.duree_jours,
        duree_heures: validatedData.duree_heures,
        lieu: validatedData.lieu,
        nb_participants_prevu: validatedData.nb_participants_prevu,
        formateurs: validatedData.formateur_id ? {
          create: {
            formateur_id: validatedData.formateur_id,
          },
        } : undefined,
      },
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
      },
    });

    return NextResponse.json(updatedFormation, { status: 200 });
  } catch (error) {
    console.error("Failed to update formation:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update formation" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a formation
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const formationId = parseInt(searchParams.get("id") || "");

    if (!formationId) {
      return NextResponse.json(
        { error: "Formation ID is required" },
        { status: 400 }
      );
    }

    await prisma.actionFormation.delete({
      where: { action_id: formationId },
    });

    return NextResponse.json(
      { message: "Formation deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete formation:", error);
    return NextResponse.json(
      { error: "Failed to delete formation" },
      { status: 500 }
    );
  }
}