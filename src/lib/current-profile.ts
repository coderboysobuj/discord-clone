import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { Profile } from "@prisma/client";

export async function currentProfile(): Promise<Profile | null> {
  const { userId } = auth();
  if (!userId) return null;

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) return null;

  return profile;
}
