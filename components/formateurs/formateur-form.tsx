"use client";
import React, { useState, useEffect, use } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Formateur, User } from "@/types";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { useFormateurMutation } from "@/hooks/useFormateurMutation";
import FileInput from "../FileInput";
import { fetchUsers } from "@/services/userService";

const formSchema = z.object({
  user_id: z.string().min(1, "User is required"),
});

type FormValues = {
  user_id: string;
};

type FormateurFormProps = {
  formateur?: Formateur;
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
};

const FormateurForm = ({
  formateur,
  isOpen,
  onClose,
  onOpenChange,
}: FormateurFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [badgeFile, setBadgeFile] = useState<File | null>(null);
  const isEditing = !!formateur;
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: "",
    },
  });

  const { data: users } = useAuthQuery(["users"], fetchUsers, "3");

  

  useEffect(() => {
    if (isOpen && formateur) {
      form.reset({
        user_id: formateur.user_id.toString(),
      });
    } else {
      form.reset({
        user_id: "",
      });
      setCvFile(null);
      setBadgeFile(null);
    }
  }, [formateur, isOpen, form]);

  const mutation = useFormateurMutation(
    isEditing,
    () => {
      queryClient.invalidateQueries({ queryKey: ["formateurs"] });
      toast.success(
        `Formateur ${isEditing ? "updated" : "created"} successfully`
      );
      onClose();
    },
    (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(
        `Failed to ${
          isEditing ? "update" : "create"
        } formateur: ${errorMessage}`
      );
      console.error(
        `Error ${isEditing ? "updating" : "creating"} formateur:`,
        error
      );
    }
  );

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
  
      if (isEditing) {
        formData.append("formateur_id", formateur.user_id);
      } else {
        formData.append("user_id", values.user_id);
      }
  
      if (cvFile) {
        formData.append("CV", cvFile); 
      }
  
      if (badgeFile) {
        formData.append("BADGE", badgeFile);
      }
  
  
      await mutation.mutateAsync(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Formateur" : "Add New Formateur"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the formateur information and click the update button"
              : "Enter the formateur information and click the save button"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isEditing && (
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users?.map((user: User) => (
                          <SelectItem
                            key={user.user_id}
                            value={user.user_id.toString()}
                          >
                            {user.prenom} {user.nom} - {user.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormItem>
              <FileInput
                accept=".pdf,.doc,.docx"
                label="CV Document"
                onChange={(e) =>
                  e.target.files?.[0] && setCvFile(e.target.files[0])
                }
              />
            </FormItem>
            <FormItem>
              <FileInput
                accept="image/*"
                label="Badge Photo"
                onChange={(e) =>
                  e.target.files?.[0] && setBadgeFile(e.target.files[0])
                }
              />
            </FormItem>
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
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

export default FormateurForm;
