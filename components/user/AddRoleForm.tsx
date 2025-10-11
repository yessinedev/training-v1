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
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRole, updateRole } from "@/services/roleService";

const formSchema = z.object({
  role_name: z
    .string()
    .min(1, "Role name is required")
    .max(50, "Role name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Role name can only contain letters and spaces"),
});

type FormValues = z.infer<typeof formSchema>;

type RoleFormProps = {
  role?: {
    role_id: number;
    role_name: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
};

const RoleForm = ({ role, isOpen, onClose, onOpenChange }: RoleFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!role;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role_name: role?.role_name || "",
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({ role_name: role.role_name });
    } else {
      form.reset({ role_name: "" });
    }
  }, [role, form]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (isEditing && role) {
        await updateRole(role.role_id, data);
      }
      await createRole(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success(`Role ${isEditing ? "modifier" : "créer"} avec succés`);
      form.reset();
      onClose();
    },
    onError: (error: Error) => {
      const message =
        error.message ||
        "Un erreur s'est produite lors de la sauvgarde du role";
      toast.error(message);
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Role" : "Add New Role"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the role name and click the update button"
              : "Enter the role name and click the save button"}
          </DialogDescription>
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
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : isEditing ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleForm;
