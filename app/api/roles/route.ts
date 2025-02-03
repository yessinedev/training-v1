import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Validation schema for role operations
const roleSchema = z.object({
  role_name: z.string()
    .min(1, "Role name is required")
    .max(50, "Role name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Role name can only contain letters and spaces"),
});

// GET handler to fetch all roles
export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      include: {
        users: true,
      }
    });
    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}

// POST handler to create a new role
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = roleSchema.parse(body);

    //add to prisma
    const newRole = await prisma.role.create({
      data: {
        role_name: validatedData.role_name,
      },
    });

    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error("Failed to create role:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create role" },
      { status: 500 }
    );
  }
}

// PUT handler to update a role
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { role_id, ...updateData } = body;

    if (!role_id) {
      return NextResponse.json(
        { error: "Role ID is required" },
        { status: 400 }
      );
    }

    // Validate update data
    const validatedData = roleSchema.parse(updateData);

    // Update the role using Prisma
    const updatedRole = await prisma.role.update({
      where: { role_id: parseInt(role_id) },
      data: {
        role_name: validatedData.role_name,
      },
    });

    return NextResponse.json(updatedRole, { status: 200 });
  } catch (error) {
    console.error("Failed to update role:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a role
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roleId = parseInt(searchParams.get("id") || "");

    if (!roleId) {
      return NextResponse.json(
        { error: "Role ID is required" },
        { status: 400 }
      );
    }

    // Delete the role using Prisma
    await prisma.role.delete({
      where: { role_id: roleId },
    });

    return NextResponse.json(
      { message: "Role deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete role:", error);
    return NextResponse.json(
      { error: "Failed to delete role" },
      { status: 500 }
    );
  }
}