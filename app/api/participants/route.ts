import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const participantSchema = z.object({
  nom: z.string().min(1, "Last name is required").max(100),
  prenom: z.string().min(1, "First name is required").max(100),
  email: z.string().email().optional().nullable(),
  telephone: z.string().optional().nullable(),
  entreprise: z.string().optional().nullable(),
  poste: z.string().optional().nullable(),
});

// GET handler to fetch all participants
export async function GET() {
  try {
    const participants = await prisma.participant.findMany({
      include: {
        actions: {
          include: {
            action: true,
          },
        },
        attestations: true,
      },
    });
    return NextResponse.json(participants, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch participants:", error);
    return NextResponse.json(
      { error: "Failed to fetch participants" },
      { status: 500 }
    );
  }
}

// POST handler to create a new participant
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = participantSchema.parse(body);

    const participant = await prisma.participant.create({
      data: validatedData,
      include: {
        actions: {
          include: {
            action: true,
          },
        },
        attestations: true,
      },
    });

    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    console.error("Failed to create participant:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create participant" },
      { status: 500 }
    );
  }
}

// PUT handler to update a participant
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { participant_id, ...updateData } = body;

    if (!participant_id) {
      return NextResponse.json(
        { error: "Participant ID is required" },
        { status: 400 }
      );
    }

    const validatedData = participantSchema.parse(updateData);

    const updatedParticipant = await prisma.participant.update({
      where: { participant_id: parseInt(participant_id.toString()) },
      data: validatedData,
      include: {
        actions: {
          include: {
            action: true,
          },
        },
        attestations: true,
      },
    });

    return NextResponse.json(updatedParticipant, { status: 200 });
  } catch (error) {
    console.error("Failed to update participant:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update participant" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a participant
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const participantId = parseInt(searchParams.get("id") || "");

    if (!participantId) {
      return NextResponse.json(
        { error: "Participant ID is required" },
        { status: 400 }
      );
    }

    await prisma.participant.delete({
      where: { participant_id: participantId },
    });

    return NextResponse.json(
      { message: "Participant deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete participant:", error);
    return NextResponse.json(
      { error: "Failed to delete participant" },
      { status: 500 }
    );
  }
}