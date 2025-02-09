import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const participantSchema = z.object({
  participant_id: z.number().int().positive(),
  statut: z.enum(["Confirmé", "En attente", "Liste d'attente"]),
});

const participantsSchema = z.union([
  participantSchema, // Single participant
  z.array(participantSchema), // Multiple participants
]);

// GET handler to fetch participants for a formation
export async function GET(
  request: Request,
  { params }: { params: Promise<{ formationId: string }> }
) {
  try {
    const { formationId } = await params;

    const participants = await prisma.actionFormationParticipant.findMany({
      where: { action_id: parseInt(formationId) },
      include: {
        participant: true,
        action: true,
      },
    });

    return NextResponse.json(participants, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch participants" },
      { status: 500 }
    );
  }
}

// PUT handler to update participant status
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ formationId: string }> }
) {
  try {
    const { formationId } = await params;
    const body = await request.json();
    const validatedData = participantSchema.parse(body);
    console.log(validatedData);
    const updatedParticipant = await prisma.actionFormationParticipant.update({
      where: {
        action_id_participant_id: {
          action_id: parseInt(formationId),
          participant_id: validatedData.participant_id,
        },
      },
      data: {
        statut: validatedData.statut,
      },
      include: {
        participant: true,
        action: true,
      },
    });

    return NextResponse.json(updatedParticipant, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update participant status" },
      { status: 500 }
    );
  }
}

// POST handler to add a participant to a formation
export async function POST(
  request: Request,
  { params }: { params: Promise<{ formationId: string }> }
) {
  try {
    const { formationId } = await params;
    const body = await request.json();
    // Validate input (can be single object or array)
    const validatedData = participantsSchema.parse(body);
    const formationIdInt = parseInt(formationId);

    // Normalize to an array (even if it's a single participant)
    const participantsArray = Array.isArray(validatedData)
      ? validatedData
      : [validatedData];

    // Handle single participant creation
    if (participantsArray.length === 1) {
      const createdParticipant = await prisma.actionFormationParticipant.create(
        {
          data: {
            action_id: formationIdInt,
            participant_id: participantsArray[0].participant_id,
            date_inscription: new Date(),
            statut: participantsArray[0].statut,
          },
          include: { participant: true, action: true },
        }
      );

      return NextResponse.json(createdParticipant, { status: 201 });
    }

    // Handle multiple participants creation
    const createdParticipants =
      await prisma.actionFormationParticipant.createMany({
        data: participantsArray.map((p) => ({
          action_id: formationIdInt,
          participant_id: p.participant_id,
          date_inscription: new Date(),
          statut: p.statut,
        })),
        skipDuplicates: true,
      });

    return NextResponse.json(
      {
        message: "Participants added successfully",
        count: createdParticipants.count,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add participants" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a participant from a formation
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ formationId: string }> }
) {
  try {
    const { formationId } = await params;
    const { searchParams } = new URL(request.url);
    const participantId = parseInt(searchParams.get("participantId") || "");

    if (!participantId) {
      return NextResponse.json(
        { error: "Participant ID is required" },
        { status: 400 }
      );
    }

    await prisma.actionFormationParticipant.delete({
      where: {
        action_id_participant_id: {
          action_id: parseInt(formationId),
          participant_id: participantId,
        },
      },
    });

    return NextResponse.json(
      { message: "Participant removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove participant" },
      { status: 500 }
    );
  }
}
