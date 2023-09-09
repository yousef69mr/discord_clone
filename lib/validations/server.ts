import { string, object } from "zod";
export const serverSchema = object({
  name: string().min(1, { message: "Server name is required" }),
  imageUrl: string().min(1, { message: "Server image is required" }),
});
