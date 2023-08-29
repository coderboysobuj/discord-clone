import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  _: Request,
  { params: { serverId } }: { params: { serverId: string } },
) {
  try {
    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    if (!server) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    return NextResponse.json(server);
  } catch (error: any) {
    console.log("[SERVER_LEAVE:PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
