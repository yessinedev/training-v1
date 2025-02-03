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
  role_id: z.string().min(1),
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
    const roleId = parseInt(validatedData.role_id);

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: validatedData.password,
        nom: validatedData.nom,
        prenom: validatedData.prenom,
        telephone: validatedData.telephone,
        role_id: roleId,
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
