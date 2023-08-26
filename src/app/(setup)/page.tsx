import { redirect } from "next/navigation";
import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";

import { Profile } from "@prisma/client";

export default async function SetupPage() {
  const profile: Profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <p className="text-4xl font-bold text-indigo-500">Create server</p>;
}
