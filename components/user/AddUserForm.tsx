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
import { Role, User } from "@/types";
import { useAuth } from "@clerk/nextjs";

const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  nom: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 characters"),
  prenom: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters"),
  telephone: z.string().min(1, "Phone number is required"),
  role_id: z.string().min(1, "Role is required"),
});

type FormValues = z.infer<typeof formSchema>;

type UserFormProps = {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
};

const UserForm = ({ user, isOpen, onClose, onOpenChange }: UserFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!user;
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      nom: "",
      prenom: "",
      telephone: "",
      role_id: "",
    },
  });

  // Reset form when user changes or dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      const values = user
        ? {
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            telephone: user.telephone,
            role_id: user.role_id.toString(),
          }
        : {
            email: "",
            password: "",
            nom: "",
            prenom: "",
            telephone: "",
            role_id: "",
          };
      console.log("Resetting form with values:", values);
      form.reset(values);
    }
  }, [user, isOpen, form]);

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const token = await getToken({ template: "my-jwt-template" });
      const response = await axiosInstance.get("/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload = {
        ...data,
        role_id: parseInt(data.role_id),
      };

      if (isEditing && user) {
        console.log(user);
        const token = await getToken({ template: "my-jwt-template" });
        const response = await axiosInstance.put(
          `/users`,
          {
            user_id: user.user_id,
            ...payload,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } else {
        const token = await getToken({ template: "my-jwt-template" });
        const response = await axiosInstance.post("/user/create", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(`User ${isEditing ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: (error: Error) => {
      toast.error(
        `Failed to ${isEditing ? "update" : "create"} user: ${error.message}`
      );
      console.error(
        `Error ${isEditing ? "updating" : "creating"} user:`,
        error
      );
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      console.log("Submitting form data:", data);
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (rolesLoading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the user information and click the update button"
              : "Enter the user information and click the save button"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles?.map((role: Role) => (
                        <SelectItem
                          key={role.role_id}
                          value={role.role_id.toString()}
                        >
                          {role.role_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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

export default UserForm;
