"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthMutation } from "@/hooks/useAuthMutation";
import { createSurvey, CreateSurveyPayload } from "@/services/surveyService";
import { useUser } from "@clerk/nextjs";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type CreateSurveyDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const CreateSurveyDialog = ({
  isOpen,
  onOpenChange,
}: CreateSurveyDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const createSurveyMutation = useAuthMutation(
    createSurvey,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["surveys"] });
        toast.success("Survey created successfully!");
        onOpenChange(false); // Close dialog on success
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        toast.error(`Failed to create survey: ${errorMessage}`);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    }
  );

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const payload: CreateSurveyPayload = {
      title: data.title,
      description: data.description,
      createdById: user?.id!,
    };
    createSurveyMutation.mutate(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Survey</DialogTitle>
          <DialogDescription>
            Enter a title and optional description for your new survey.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Survey Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the purpose of this survey..."
                      {...field}
                      value={field.value ?? ""} // Handle potential null/undefined
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Survey"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSurveyDialog;
