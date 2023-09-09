"use client";

import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";

import { useModal } from "@hooks/use-modal-store";

import axios, { CancelTokenSource } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useState } from "react";

const DeleteServerModal = () => {
  const {isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteServer";

  const { server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onConfirm = async () => {
    let cancelToken: CancelTokenSource | undefined;
    try {
      setIsLoading(true);
      const cancelTokenSource = axios.CancelToken.source();
      cancelToken = cancelTokenSource;

      await axios.delete(`/api/servers/${server?.id}`, {
        cancelToken: cancelTokenSource.token,
      });

      onClose();
      router.refresh();
      router.push("/");
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }

    return () => {
      if (cancelToken) {
        cancelToken.cancel("Request canceled by user");
      }
    };
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>{" "}
            Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>{" "}
            server will be permanently deleted
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4 bg-gray-100">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} variant={"ghost"} onClick={onClose}>
              Cancel
            </Button>
            {isLoading ? (
              <Button variant={"primary"} disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming...
              </Button>
            ) : (
              <Button
                disabled={isLoading}
                variant={"primary"}
                onClick={onConfirm}
              >
                Confirm
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServerModal;
