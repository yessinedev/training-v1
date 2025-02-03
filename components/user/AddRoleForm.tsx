"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

// Define the form validation schema
const formSchema = z.object({
  role_name: z
    .string()
    .min(1, "Role name is required")
    .max(50, "Role name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Role name can only contain letters and spaces"),
});

type FormValues = z.infer<typeof formSchema>;

const AddRoleForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role_name: "",
    },
  });

  // Initialize the query client
  const queryClient = useQueryClient();

  // Define the mutation
  const addRoleMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await axiosInstance.post("/roles", data);
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data.message || "Failed to add role");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role added successfully");
      form.reset();
      setIsOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      console.error("Error adding role:", error);
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await addRoleMutation.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Role</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter role name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setIsOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoleForm;
