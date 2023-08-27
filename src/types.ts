import { Member, Profile, Server } from "@prisma/client";

export type UploadthingEndpoint = "serverImage" | "messageFile";

export type ModalType = "createServer" | "editServer" | "createChannel";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};
