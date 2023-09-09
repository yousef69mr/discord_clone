"use client";

import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";

import { Label } from "@components/ui/label";

import { useModal } from "@hooks/use-modal-store";
import { useOrigin } from "@hooks/use-origin";
import axios from "axios";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";

const InviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";

  const { server } = data;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteLink || inviteUrl);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
      onOpen("invite", { server: response.data });
      setInviteLink(`${origin}/invite/${response.data.inviteCode}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server invitation link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="border-0 bg-zinc-300/50 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteLink || inviteUrl}
              readOnly
              disabled={isLoading}
            />
            <Button disabled={isLoading} onClick={onCopy} size={"icon"}>
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-center mt-2 gap-x-2">
            <FacebookShareButton
              url={inviteLink || inviteUrl}
              quote={`${server?.name} server`}
              hashtag={`${server?.name}`}
              disabled={isLoading}
            >
              <FacebookIcon size={40} round />
            </FacebookShareButton>

            <WhatsappShareButton
              url={inviteLink || inviteUrl}
              title={server?.name}
              disabled={isLoading}
            >
              <WhatsappIcon size={40} round />
            </WhatsappShareButton>

            <LinkedinShareButton
              url={inviteLink || inviteUrl}
              title={server?.name}
              disabled={isLoading}
            >
              <LinkedinIcon size={40} round />
            </LinkedinShareButton>
            <TwitterShareButton
              url={inviteLink || inviteUrl}
              title={`${server?.name} server`}
              hashtags={[`${server?.name}`]}
              via={"discord"}
              disabled={isLoading}
            >
              <TwitterIcon size={40} round />
            </TwitterShareButton>
          </div>
          <Button
            disabled={isLoading}
            onClick={onNew}
            variant={"link"}
            size={"sm"}
            className="text-xs text-zinc-500 mt-4"
          >
            Generate a new link{" "}
            <RefreshCw
              className={`w-4 h-4 ml-2 ${
                isLoading && "animate-spin repeat-infinite"
              }`}
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
