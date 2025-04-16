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
import { CreateParticipant, Role, User } from "@/types";
import { useAuth } from "@clerk/nextjs";
import FileInput from "../FileInput";
import { createOrUpdateFormateur } from "@/services/formateurService";
import { createOrUpdateParticipant } from "@/services/participantService";

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
  role_name: z.string().optional(),
  cv_file: z.instanceof(File).optional(),
  badge_file: z.instanceof(File).optional(),
  entreprise: z.string().optional(),
  poste: z.string().optional(),
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
      email: user?.email || "",
      nom: user?.nom || "",
      prenom: user?.prenom || "",
      telephone: user?.telephone || "",
      role_id: user?.role_id?.toString() || "",
      role_name: "",
      cv_file: undefined,
      badge_file: undefined,
      entreprise: "",
      poste: "",
    },
  });

  const { data: roles, isLoading: rolesLoading } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const token = await getToken({ template: "my-jwt-template" });
      const response = await axiosInstance.get("/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });

  // Reset form when user changes or dialog opens/closes
  useEffect(() => {
    if (isOpen && roles) {
      const selectedRole = roles.find(
        (r) => r.role_id.toString() === user?.role_id.toString()
      );
      const values = user
        ? {
            role_name: selectedRole?.role_name || "",
          }
        : {
            email: "",
            password: "",
            nom: "",
            prenom: "",
            telephone: "",
            role_id: "",
            role_name: "",
          };
      console.log("Resetting form with values:", values);
      form.reset(values);
    }
  }, [user, isOpen, form]);

  const watchRoleId = form.watch("role_id");

  useEffect(() => {
    if (watchRoleId && roles) {
      const selectedRole = roles.find(
        (r) => r.role_id.toString() === watchRoleId
      );
      form.setValue("role_name", selectedRole?.role_name || "");
    }
  }, [watchRoleId, roles, form]);

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const userPayload = {
        email: data.email,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        role_id: parseInt(data.role_id),
      };

      if (isEditing && user) {
        console.log(user);
        const token = await getToken({ template: "my-jwt-template" });
        const response = await axiosInstance.put(
          `/users/${user.user_id}`,
          {
            user_id: user.user_id,
            ...userPayload,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } else {
        const token = await getToken({ template: "my-jwt-template" });
        const response = await axiosInstance.post(
          "/users/create",
          userPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          if (data.role_name === "FORMATEUR") {
            const formData = new FormData();
            console.log("user_id", response.data);
            formData.append("user_id", response.data.user_id);
            formData.append("files", data.cv_file as File);
            formData.append("files", data.badge_file as File);

            await createOrUpdateFormateur(token as string, formData, false);
          } else if (data.role_name === "PARTICIPANT") {
            const participantPayload: CreateParticipant = {
              user_id: response.data.user_id,
              entreprise: data.entreprise as string,
              poste: data.poste as string,
            };
            await createOrUpdateParticipant(
              token as string,
              participantPayload,
              false
            );
          }
        }
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
          <DialogTitle>
            {isEditing ? "Modifier un Utilisateur" : "Ajouter un utilisateur"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "modifier les informations de l'utilisateur et cliquer sur le bouton de mise à jour"
              : "ajouter un nouvel utilisateur et cliquer sur le bouton d'enregistrement"}
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
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom" {...field} />
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
                  <FormLabel>Prenom</FormLabel>
                  <FormControl>
                    <Input placeholder="Prenom" {...field} />
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
                  <FormLabel>Telephone</FormLabel>
                  <FormControl>
                    <Input placeholder="Numero de telephone" {...field} />
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
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selectedRole = roles?.find(
                        (r) => r.role_id.toString() === value
                      );
                      form.setValue("role_name", selectedRole?.role_name || "");
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner un role">
                          {form.watch("role_name") || "Selectionner un role"}
                        </SelectValue>
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
            {form.watch("role_name") === "FORMATEUR" && (
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="cv_file"
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormControl>
                        <FileInput
                          accept=".pdf,.doc,.docx"
                          label="CV Document"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="badge_file"
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormControl>
                        <FileInput
                          accept="image/*"
                          label="Badge Photo"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {form.watch("role_name") === "PARTICIPANT" && (
              <div>
                <FormField
                  control={form.control}
                  name="entreprise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entreprise</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom d'entreprise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="poste"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poste</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Poste actuelle dans l'entreprise"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
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
