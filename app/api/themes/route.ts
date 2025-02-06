import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const themeSchema = z.object({
  libelle_theme: z.string()
    .min(1, "Theme name is required")
    .max(100, "Theme name must be less than 100 characters"),
  domaine_id: z.number()
    .int()
    .positive("Domain ID must be a positive number"),
});

// GET handler to fetch all themes
export async function GET() {
  try {
    const themes = await prisma.theme.findMany({
      include: {
        domaine: true,
      },
    });
    return NextResponse.json(themes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch themes" },
      { status: 500 }
    );
  }
}

// POST handler to create a new theme
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = themeSchema.parse(body);

    const theme = await prisma.theme.create({
      data: {
        libelle_theme: validatedData.libelle_theme,
        domaine_id: validatedData.domaine_id,
      },
      include: {
        domaine: true,
      },
    });

    return NextResponse.json(theme, { status: 201 });
  } catch (error) {

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create theme" },
      { status: 500 }
    );
  }
}

// PUT handler to update a theme
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { theme_id, ...updateData } = body;

    if (!theme_id) {
      return NextResponse.json(
        { error: "Theme ID is required" },
        { status: 400 }
      );
    }

    const validatedData = themeSchema.parse(updateData);

    const updatedTheme = await prisma.theme.update({
      where: { theme_id: parseInt(theme_id.toString()) },
      data: {
        libelle_theme: validatedData.libelle_theme,
        domaine_id: validatedData.domaine_id,
      },
      include: {
        domaine: true,
      },
    });

    return NextResponse.json(updatedTheme, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update theme" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a theme
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const themeId = parseInt(searchParams.get("id") || "");

    if (!themeId) {
      return NextResponse.json(
        { error: "Theme ID is required" },
        { status: 400 }
      );
    }

    await prisma.theme.delete({
      where: { theme_id: themeId },
    });

    return NextResponse.json(
      { message: "Theme deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete theme" },
      { status: 500 }
    );
  }
}