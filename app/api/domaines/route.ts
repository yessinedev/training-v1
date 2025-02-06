import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const domaineSchema = z.object({
  libelle_domaine: z.string()
    .min(1, "Domain name is required")
    .max(100, "Domain name must be less than 100 characters"),
});

// GET handler to fetch all domains
export async function GET() {
  try {
    const domaines = await prisma.domaine.findMany({
      include: {
        themes: true,
      },
    });
    return NextResponse.json(domaines, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch domains" },
      { status: 500 }
    );
  }
}

// POST handler to create a new domain
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = domaineSchema.parse(body);

    const domaine = await prisma.domaine.create({
      data: {
        libelle_domaine: validatedData.libelle_domaine,
      },
      include: {
        themes: true,
      },
    });

    return NextResponse.json(domaine, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create domain" },
      { status: 500 }
    );
  }
}

// PUT handler to update a domain
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { domaine_id, ...updateData } = body;

    if (!domaine_id) {
      return NextResponse.json(
        { error: "Domain ID is required" },
        { status: 400 }
      );
    }

    const validatedData = domaineSchema.parse(updateData);

    const updatedDomaine = await prisma.domaine.update({
      where: { domaine_id: parseInt(domaine_id.toString()) },
      data: {
        libelle_domaine: validatedData.libelle_domaine,
      },
      include: {
        themes: true,
      },
    });

    return NextResponse.json(updatedDomaine, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update domain" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a domain
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domaineId = parseInt(searchParams.get("id") || "");

    if (!domaineId) {
      return NextResponse.json(
        { error: "Domain ID is required" },
        { status: 400 }
      );
    }

    await prisma.domaine.delete({
      where: { domaine_id: domaineId },
    });

    return NextResponse.json(
      { message: "Domain deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete domain" },
      { status: 500 }
    );
  }
}