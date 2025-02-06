import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const formateurSchema = z.object({
  user_id: z.number().int().positive(),
  cv: z.string().optional(),
  badge: z.string().optional(),
});

// GET handler to fetch all formateurs
export async function GET() {
  try {
    const formateurs = await prisma.formateur.findMany({
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });
    return NextResponse.json(formateurs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch formateurs" },
      { status: 500 }
    );
  }
}

// POST handler to create a new formateur
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const userId = parseInt(formData.get('user_id') as string);
    const cvFile = formData.get('cv') as File;
    const badgeFile = formData.get('badge') as File;

    let cvPath = null;
    let badgePath = null;

    if (cvFile) {
      const cvBuffer = await cvFile.arrayBuffer();
      const cvBase64 = Buffer.from(cvBuffer).toString('base64');
      const cvResult = await cloudinary.uploader.upload(
        `data:${cvFile.type};base64,${cvBase64}`,
        { folder: 'formateurs/cv' }
      );
      cvPath = cvResult.secure_url;
    }

    if (badgeFile) {
      const badgeBuffer = await badgeFile.arrayBuffer();
      const badgeBase64 = Buffer.from(badgeBuffer).toString('base64');
      const badgeResult = await cloudinary.uploader.upload(
        `data:${badgeFile.type};base64,${badgeBase64}`,
        { folder: 'formateurs/badges' }
      );
      badgePath = badgeResult.secure_url;
    }

    const formateur = await prisma.formateur.create({
      data: {
        user_id: userId,
        cv_path: cvPath,
        badge_path: badgePath,
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });

    return NextResponse.json(formateur, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create formateur" },
      { status: 500 }
    );
  }
}

// PUT handler to update a formateur
export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const formateurId = parseInt(formData.get('formateur_id') as string);
    const cvFile = formData.get('cv') as File;
    const badgeFile = formData.get('badge') as File;

    const existingFormateur = await prisma.formateur.findUnique({
      where: { formateur_id: formateurId },
    });

    if (!existingFormateur) {
      return NextResponse.json(
        { error: "Formateur not found" },
        { status: 404 }
      );
    }

    let cvPath = existingFormateur.cv_path;
    let badgePath = existingFormateur.badge_path;

    if (cvFile) {
      const cvBuffer = await cvFile.arrayBuffer();
      const cvBase64 = Buffer.from(cvBuffer).toString('base64');
      const cvResult = await cloudinary.uploader.upload(
        `data:${cvFile.type};base64,${cvBase64}`,
        { folder: 'formateurs/cv' }
      );
      cvPath = cvResult.secure_url;
    }

    if (badgeFile) {
      const badgeBuffer = await badgeFile.arrayBuffer();
      const badgeBase64 = Buffer.from(badgeBuffer).toString('base64');
      const badgeResult = await cloudinary.uploader.upload(
        `data:${badgeFile.type};base64,${badgeBase64}`,
        { folder: 'formateurs/badges' }
      );
      badgePath = badgeResult.secure_url;
    }

    const updatedFormateur = await prisma.formateur.update({
      where: { formateur_id: formateurId },
      data: {
        cv_path: cvPath,
        badge_path: badgePath,
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });

    return NextResponse.json(updatedFormateur, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update formateur" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a formateur
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const formateurId = parseInt(searchParams.get("id") || "");

    if (!formateurId) {
      return NextResponse.json(
        { error: "Formateur ID is required" },
        { status: 400 }
      );
    }

    const formateur = await prisma.formateur.delete({
      where: { formateur_id: formateurId },
    });

    // Delete files from Cloudinary
    if (formateur.cv_path) {
      const cvPublicId = formateur.cv_path.split('/').pop()?.split('.')[0];
      if (cvPublicId) {
        await cloudinary.uploader.destroy(`formateurs/cv/${cvPublicId}`);
      }
    }

    if (formateur.badge_path) {
      const badgePublicId = formateur.badge_path.split('/').pop()?.split('.')[0];
      if (badgePublicId) {
        await cloudinary.uploader.destroy(`formateurs/badges/${badgePublicId}`);
      }
    }

    return NextResponse.json(
      { message: "Formateur deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete formateur" },
      { status: 500 }
    );
  }
}