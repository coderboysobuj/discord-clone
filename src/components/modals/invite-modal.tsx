"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import toast from "react-hot-toast";
import { useState } from "react";
import { CheckIcon, CopyIcon, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { cn } from "@/lib/utils";
import axios from "axios";

export const InviteModal = () => {
  const {
    onOpen,
    isOpen,
    onClose,
    type,
    data: { server },
  } = useModal();
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    setIsCopy(true);
    navigator.clipboard.writeText(inviteUrl);
    toast.success("Invite link added to your clipboard");
    setTimeout(() => {
      setIsCopy(false);
    }, 1000);
  };

  const handleClose = () => {
    onClose();
  };

  const refreshInviteUrl = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`,
      );
      onOpen("invite", { server: response.data });
      toast.success("Invite link regenerated");
    } catch (error) {
      toast.error("Something went wrong, please try again after some times");
      console.log("INVITE MODAL ERROR", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite friends</DialogTitle>
          <DialogDescription>
            Share the Experience: Invite Your Friends! Connect, collaborate, and
            enjoy together. Use this invite link to bring your friends onboard
            and make our community even better.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <div className="flex items-center gap-x-2">
            <Input
              disabled={isLoading}
              value={inviteUrl}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button size="icon" disabled={isLoading} onClick={onCopy}>
              {isCopy ? (
                <CheckIcon className="w-4 h-4" />
              ) : (
                <CopyIcon className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            type="button"
            onClick={refreshInviteUrl}
            disabled={isLoading}
            size="sm"
            className="mt-4 text-sm hover:text-indigo-500/80"
            variant="link"
          >
            Generate a new link
            <RefreshCw
              className={cn("w-4 h-4 ml-2", isLoading && "animate-spin")}
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
