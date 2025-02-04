import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const participantSchema = z.object({
  participant_id: z.number().int().positive(),
  statut: z.enum(["Confirmé", "En attente", "Liste d'attente"]),
});

// GET handler to fetch participants for a formation
export async function GET(
  request: Request,
  { params }: { params: Promise<{ formationId: string }> }
) {
  try {
    const {formationId} = await params;

    // First get the participants
    const participants = await prisma.actionFormationParticipant.findMany({
      where: { action_id: parseInt(formationId) },
      include: {
        participant: true,
      },
    });

    // Then get the attestations separately
    const attestations = await prisma.attestation.findMany({
      where: {
        action_id: parseInt(formationId),
        participant_id: {
          in: participants.map(p => p.participant_id),
        },
      },
    });

    // Combine the data
    const participantsWithAttestations = participants.map(participant => ({
      ...participant,
      attestation: attestations.find(
        att => att.participant_id === participant.participant_id
      ),
    }));

    return NextResponse.json(participantsWithAttestations, { status: 200 });
  } catch (error) {
    if (error instanceof Error){
      console.log("Error: ", error.stack)
  }
    return NextResponse.json(
      { error: "Failed to fetch participants" },
      { status: 500 }
    );
  }
}

// POST handler to add a participant to a formation
export async function POST(
  request: Request,
  { params }: { params: Promise<{ formationId: number }> }
) {
  try {
    const {formationId} = await params;
    const body = await request.json();
    const validatedData = participantSchema.parse(body);

    const participant = await prisma.actionFormationParticipant.create({
      data: {
        action_id: formationId,
        participant_id: validatedData.participant_id,
        date_inscription: new Date(),
        statut: validatedData.statut,
      },
      include: {
        participant: true,
      },
    });

    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    if (error instanceof Error){
      console.log("Error: ", error.stack)
  }
    return NextResponse.json(
      { error: "Failed to add participant" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a participant from a formation
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ formationId: number }> }
) {
  try {
    const {formationId} = await params;
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
          action_id: formationId,
          participant_id: participantId,
        },
      },
    });

    return NextResponse.json(
      { message: "Participant removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error){
      console.log("Error: ", error.stack)
  }
    return NextResponse.json(
      { error: "Failed to remove participant" },
      { status: 500 }
    );
  }
}