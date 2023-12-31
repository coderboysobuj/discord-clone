import { Member, Profile, Server } from "@prisma/client";

export type UploadthingEndpoint = "serverImage" | "messageFile";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
| "editChannel"
| "deleteChannel"
  ;

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};
