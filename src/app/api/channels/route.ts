import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unautenticated", { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    const { name, type } = await req.json();

    if (!name || !type) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Channel name cannot be 'general'", {
        status: 400,
      });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error: any) {
    console.error("CHANNELS:POST", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
