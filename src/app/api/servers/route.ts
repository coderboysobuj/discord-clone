import { NextResponse } from "next/server";
import { v4 as uuidV4 } from "uuid";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, imageUrl } = await req.json();

    if (typeof name !== "string" || typeof imageUrl !== "string") {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidV4(),
        channels: {
          create: [
            {
              name: "general",
              profileId: profile.id,
            },
          ],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS:POST]", error);
    return new NextResponse("Internal", { status: 500 });
  }
}
