"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { ActionTooltip } from "@/components/action-tooltip";
import { Server } from "@prisma/client";

interface NavigationItemProps {
  server: Pick<Server, "id" | "imageUrl" | "name">;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({ server }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <ActionTooltip label={server.name} align="center" side="left">
      <button className="group relative flex items-center">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-1",
            params?.serverId !== server.id && "group-hover:h-5",
            params?.serverId === server.id ? "h-8" : "h-2",
          )}
        />
        <div
          className={cn(
            "relative group flex w-12 h-12 mx-3 rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden",
            params?.serverId === server.id &&
              "bg-primary/10 text-primary rounded-2xl",
          )}
        >
          <Image alt={server.name} src={server.imageUrl} fill />
        </div>
      </button>
    </ActionTooltip>
  );
};
