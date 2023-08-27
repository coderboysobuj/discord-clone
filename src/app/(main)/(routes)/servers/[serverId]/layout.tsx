import { ServerSidebar } from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { notFound } from "next/navigation";

type ServerLayoutProps = {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
};
export default async function ServerLayout({
  children,
  params,
}: ServerLayoutProps) {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          id: profile.id,
        },
      },
    },
  });

  if (!server) return notFound();

  return (
    <div className="h-full">
      <div className="hidden md:flex flex-col h-full w-60 z-20 fixed inset-y-0">
        <ServerSidebar serverId={server.id} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
}
