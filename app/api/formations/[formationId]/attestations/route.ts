import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST handler to generate attestations for participants
export async function POST(
  request: Request,
  { params }: { params: Promise<{ formationId: string }> }
) {
  try {
    const {formationId} = await params

    // Get all confirmed participants without attestations
    const participants = await prisma.actionFormationParticipant.findMany({
      where: {
        action_id: parseInt(formationId),
        statut: "Confirmé",
        NOT: {
          participant: {
            attestations: {
              some: {
                action_id: parseInt(formationId)
              }
            }
          }
        }
      },
      include: {
        participant: true,
      },
    });

    // Generate attestations for each participant
    const attestations = await Promise.all(
      participants.map(async (participant) => {
        const qrCodeRef = `ATT-${formationId}-${participant.participant_id}-${Date.now()}`;
        
        return prisma.attestation.create({
          data: {
            participant_id: participant.participant_id,
            action_id: parseInt(formationId),
            date_emission: new Date(),
            qr_code_ref: qrCodeRef,
          },
          include: {
            participant: true,
            action: true,
          },
        });
      })
    );

    return NextResponse.json(attestations, { status: 201 });
  } catch (error) {
    console.error("Failed to generate attestations:", error);
    return NextResponse.json(
      { error: "Failed to generate attestations" },
      { status: 500 }
    );
  }
}