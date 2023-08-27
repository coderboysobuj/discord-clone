import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NavigationActions } from "./navigation-actions";
import { NavigationItem } from "./navigation-item";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export async function NavigationSidebar() {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <aside className="space-y-4 flex flex-col items-center h-full w-full py-3">
      <NavigationActions />
      <Separator className="rounded-md w-10 mx-auto h-[2px]" />

      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              server={{
                id: server.id,
                name: server.name,
                imageUrl: server.imageUrl,
              }}
            />
          </div>
        ))}
      </ScrollArea>
    </aside>
  );
}
