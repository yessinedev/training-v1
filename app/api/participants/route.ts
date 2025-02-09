import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const participantSchema = z.object({
  nom: z.string().min(1, "Last name is required").max(100),
  prenom: z.string().min(1, "First name is required").max(100),
  email: z.string().email().optional().nullable(),
  telephone: z.string(),
  entreprise: z.string().optional().nullable(),
  poste: z.string().optional().nullable(),
});

const participantsSchema = z.array(participantSchema);
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
    return NextResponse.json(
      { error: "Failed to fetch participants" },
      { status: 500 }
    );
  }
}

// POST handler to create a new participant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);
    // Check if body contains an array (for createMany) or a single object
    if (Array.isArray(body)) {
      const validatedData = participantsSchema.parse(body);
      // Use createMany for bulk insertion
      const createdParticipants = await prisma.participant.createMany({
        data: validatedData,
        skipDuplicates: true, // Avoid inserting duplicate records
      });

      // Retrieve the inserted participants
      const insertedParticipants = await prisma.participant.findMany({
        where: {
          telephone: { in: validatedData.map((p) => p.telephone ) },
        },
      });

      return NextResponse.json(
        {
          insertedParticipants,
        },
        { status: 201 }
      );
    } else {
      // Handle single participant creation (existing logic)
      const validatedData = participantSchema.parse(body);

      const participant = await prisma.participant.create({
        data: validatedData,
        include: {
          actions: { include: { action: true } },
          attestations: true,
        },
      });

      return NextResponse.json(participant, { status: 201 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create participant(s)", message: error },
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
    return NextResponse.json(
      { error: "Failed to delete participant" },
      { status: 500 }
    );
  }
}
