'use client'
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserAvatarProps = {
  src: string;
  name: string;
  className?: string;
};
export const UserAvatar = ({ src, name, className }: UserAvatarProps) => {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
      <AvatarImage src={src} />
      <AvatarFallback>
        {name.split(" ").map((n) => n.split("")[0])}
      </AvatarFallback>
    </Avatar>
  );
};
