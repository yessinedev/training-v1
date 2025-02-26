import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for creating a user
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nom: z.string().min(1).max(100),
  prenom: z.string().min(1).max(100),
  telephone: z.string().min(1),
  role_id: z.number().min(1),
});

// Validation schema for updating a user
const updateUserSchema = z.object({
  user_id: z.number(),
  email: z.string().email(),
  nom: z.string().min(1).max(100),
  prenom: z.string().min(1).max(100),
  telephone: z.string().min(1),
  role_id: z.number().min(1),
  password: z.string().min(6).optional(),
});

// GET handler to fetch all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true, // Include role information in the response
      },
    });
    console.log(users);
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST handler to create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = createUserSchema.parse(body);

    // Convert role_id to number since it comes as string from the form

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        nom: validatedData.nom,
        prenom: validatedData.prenom,
        telephone: validatedData.telephone,
        role_id: validatedData.role_id,
      },
      include: {
        role: true, // Include role information in the response
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Failed to create user:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { user_id, ...updateData } = body;
    console.log('userId', user_id);

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    // Convert role_id to number
    // Validate update data
    const validatedData = updateUserSchema.parse({...updateData, user_id: user_id});


    // Prepare update data
    const dataToUpdate: any = {
      email: validatedData.email,
      nom: validatedData.nom,
      prenom: validatedData.prenom,
      telephone: validatedData.telephone,
      role_id: validatedData.role_id,
    };

    // Only include password in update if it's provided
    if (validatedData.password) {
      dataToUpdate.password = validatedData.password;
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { user_id: user_id },
      data: dataToUpdate,
      include: {
        role: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Failed to update user:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a user
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("id") || "");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Delete the user
    await prisma.user.delete({
      where: {
        user_id: userId,
      },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
