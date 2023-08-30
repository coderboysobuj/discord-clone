"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useModal } from "@/hooks/use-modal-store";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const LeaveServerModal = () => {
  const {
    isOpen,
    onClose,
    type,
    data: { server },
  } = useModal();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isModalOpen = isOpen && type === "leaveServer";
  const router = useRouter();

  const onLeave = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave`);
      toast.success("You successfully left the server.");
      router.refresh();
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong, please try again after some times");
      console.log("INVITE MODAL ERROR", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave server</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave{" "}
            <span className="font-bold text-indigo-500">{server?.name}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button disabled={isLoading} onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button autoFocus variant="destructive" disabled={isLoading} onClick={onLeave}>
            Leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
