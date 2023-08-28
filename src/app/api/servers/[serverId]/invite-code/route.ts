import { v4 as uuidV4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  _: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Bad Request", { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidV4(),
      },
    });
    if (!server) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    return NextResponse.json(server);
  } catch (error) {
    console.log("REFREST_INVITE:PUTCH", error);
  }
}
