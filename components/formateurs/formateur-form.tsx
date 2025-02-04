'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Formateur, User } from "@/types";
import { Upload } from "lucide-react";

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

const FormateurForm = ({ formateur, isOpen, onClose, onOpenChange }: FormateurFormProps) => {
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

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users");
      return response.data;
    },
  });

  const availableUsers = users?.filter(
    (user: User) => 
      user.role.role_name === 'Formateur' && 
      (!formateur || user.user_id === formateur.user_id)
  );

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

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (isEditing) {
        const response = await axiosInstance.put(`/formateurs`, data);
        return response.data;
      } else {
        const response = await axiosInstance.post("/formateurs", data);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formateurs"] });
      toast.success(`Formateur ${isEditing ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Failed to ${isEditing ? "update" : "create"} formateur: ${error.message}`);
      console.error(`Error ${isEditing ? "updating" : "creating"} formateur:`, error);
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      if (isEditing) {
        formData.append('formateur_id', formateur.formateur_id.toString());
      } else {
        formData.append('user_id', values.user_id);
      }

      if (cvFile) {
        formData.append('cv', cvFile);
      }

      if (badgeFile) {
        formData.append('badge', badgeFile);
      }

      await mutation.mutateAsync(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleBadgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setBadgeFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Formateur" : "Add New Formateur"}</DialogTitle>
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableUsers?.map((user: User) => (
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
              <FormLabel>CV Document</FormLabel>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvChange}
                />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Accepted formats: PDF, DOC, DOCX
              </p>
            </FormItem>

            <FormItem>
              <FormLabel>Badge Photo</FormLabel>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleBadgeChange}
                />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Accepted formats: JPG, PNG, GIF
              </p>
            </FormItem>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
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