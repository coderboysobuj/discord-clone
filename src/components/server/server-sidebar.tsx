import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { notFound } from "next/navigation";
import { ServerHeader } from "./server-header";

type ServerSidebarProps = {
  serverId: string;
};
export async function ServerSidebar({ serverId }: ServerSidebarProps) {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  if (!server) return notFound();

  const textChannels = server.channels.filter(
    (c) => c.type === ChannelType.TEXT,
  );
  const audioChannels = server.channels.filter(
    (c) => c.type === ChannelType.AUDIO,
  );
  const videoChannels = server.channels.filter(
    (c) => c.type === ChannelType.VIDEO,
  );
  const members = server.members.filter((m) => m.id !== profile.id);
  const role = server.members.find((member) => member.profileId === profile.id)
    ?.role;

  return (
    <div className="flex flex-col h-full bg-secondary-foreground">
      <ServerHeader role={role} server={server} />
    </div>
  );
}
