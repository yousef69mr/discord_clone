import { object, string } from "zod";

export const messageSchema = object({
  content: string().min(1),
});

export const attachmentSchema = object({
  fileUrl: string().min(1, { message: "Attachment is required" }),
});
