"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@lib/utils";
import ActionTooltip from "@components/action-tooltip";

interface Props {
  id: string;
  imageUrl: string;
  name: string;
}
const NavigationItem = (props: Props) => {
  const { id, name, imageUrl } = props;

  const param = useParams();
  const router = useRouter();

  return (
    <ActionTooltip side="right" label={name} align="center">
      <button
        type="button"
        onClick={() => router.push(`/servers/${id}`)}
        className="relative group flex items-center"
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            param?.serverId !== id && "group-hover:h-[20px]",
            param?.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            param?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image
            fill
            src={imageUrl}
            priority
            sizes="32x32 64x64"
            alt="Channel"
          />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
