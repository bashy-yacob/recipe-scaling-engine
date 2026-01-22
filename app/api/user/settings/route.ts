import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const settingsSchema = z.object({
  name: z.string().min(1).optional(),
  preferredSystem: z.enum(["metric", "imperial"]).optional(),
  language: z.enum(["he", "en"]).optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "לא מחובר" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = settingsSchema.parse(body);

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.preferredSystem && { preferredSystem: data.preferredSystem }),
        ...(data.language && { language: data.language }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        preferredSystem: true,
        language: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "שגיאה בעדכון ההגדרות" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "לא מחובר" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        preferredSystem: true,
        language: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "משתמש לא נמצא" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { error: "שגיאה בטעינת ההגדרות" },
      { status: 500 }
    );
  }
}
