"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";

import {
  Form,
  FormControl,
  FormMessage,
  FormField,
  FormItem,
} from "@components/ui/form";

import FileUpload from "@components/file-upload";

import { Loader2 } from "lucide-react";

import { Button } from "@components/ui/button";

import qs from "query-string";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { attachmentSchema } from "@lib/validations/message";
import * as z from "zod";

import axios, { CancelTokenSource } from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@hooks/use-modal-store";

const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModelOpen = isOpen && type === "messageFile";
  const { apiUrl, query } = data;

  const form = useForm<z.infer<typeof attachmentSchema>>({
    resolver: zodResolver(attachmentSchema),
    defaultValues: {
      fileUrl: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof attachmentSchema>) => {
    let cancelToken: CancelTokenSource | undefined;
    try {
      const cancelTokenSource = axios.CancelToken.source();
      cancelToken = cancelTokenSource;

      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      await axios.post(
        url,
        { ...values, content: values.fileUrl },
        {
          cancelToken: cancelTokenSource.token,
        }
      );

      form.reset();
      router.refresh();
      // onClose();
      handleClose();
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.error(error.message);
      }
    }

    return () => {
      if (cancelToken) {
        cancelToken.cancel("Request canceled by user");
      }
    };
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };
  return (
    <Dialog open={isModelOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              {!isLoading ? (
                <Button type="submit" variant={"primary"}>
                  Send
                </Button>
              ) : (
                <Button variant={"primary"} disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
