import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType, MemberRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "./server-search";
import { HashIcon, MicIcon, ShieldAlert, ShieldCheck, VideoIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

type ServerSidebarProps = {
  serverId: string;
};

const iconMap = {
  [ChannelType.TEXT]: <HashIcon className='h-4 w-4 mr-2' />,
  [ChannelType.AUDIO]: <MicIcon className='h-4 w-4 mr-2' />,
  [ChannelType.VIDEO]: <VideoIcon className='h-4 w-4 mr-2' />,
}
const roleMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className='w-4 h-4 text-indigo-500' />,
  [MemberRole.ADMIN]: <ShieldAlert className='w-4 h-4 text-rose-500' />,
}

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
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader role={role} server={server} />
      <ScrollArea className="flex px-3">
        <div className="mt-2">
          <ServerSearch
           data={[
             {
                label: "Text Channels",
                type: 'channel',
                data: textChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: "Voice Channels",
                type: 'channel',
                data: audioChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: "Video Channels",
                type: 'channel',
                data: videoChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },

              {
                label: "Members",
                type: 'member',
                data: members?.map(member => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleMap[member.role]
                }))
              }
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length ? (
          <div className="mb-2">
           <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        ) : null}

        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="Members"
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <ServerMember
                  key={member.id}
                  member={member}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
