import { ChannelType } from "@prisma/client";
import { string, object, nativeEnum } from "zod";
export const channelSchema = object({
  name: string()
    .min(1, { message: "Channel name is required" })
    .refine((name) => name.toLowerCase() !== "general", {
      message: "Channel name cannot be 'general'",
    }),
  type: nativeEnum(ChannelType),
});
