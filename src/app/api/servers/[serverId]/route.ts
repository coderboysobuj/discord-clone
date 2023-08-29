import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function PATCH(
  req: Request,
  { params: { serverId } }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, imageUrl } = await req.json();

    if (typeof name !== "string" || typeof imageUrl !== "string") {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_SERVERID:PATCH]", error);
    return new NextResponse("Internal", { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params: { serverId } }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const server = await db.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    if (!server) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_SERVERID:DELETE]", error);
    return new NextResponse("Internal", { status: 500 });
  }
}
