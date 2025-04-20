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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

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

const getDefaultValues = (user?: User, roles?: Role[]) => {
  const role = roles?.find(
    (r) => r.role_id.toString() === user?.role_id.toString()
  );
  return {
    email: user?.email || "",
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    telephone: user?.telephone || "",
    role_id: user?.role_id?.toString() || "",
    role_name: role?.role_name || "",
    cv_file: undefined,
    badge_file: undefined,
    entreprise: "",
    poste: "",
  };
};

const UserForm = ({ user, isOpen, onClose, onOpenChange }: UserFormProps) => {
  const isEditing = Boolean(user);
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(user),
  });

  const { data: roles = [], isLoading: rolesLoading } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const token = await getToken({ template: "my-jwt-template" });
      const { data } = await axiosInstance.get("/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  useEffect(() => {
    if (isOpen && roles) {
      form.reset(getDefaultValues(user, roles));
    }
  }, [isOpen, roles.length]);

  const roleName = form.watch("role_name");
  const roleId = form.watch("role_id");

  useEffect(() => {
    const selectedRole = roles.find((r) => r.role_id.toString() === roleId);
    form.setValue("role_name", selectedRole?.role_name || "");
  }, [roleId]);

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const token = await getToken({ template: "my-jwt-template" });
      const userPayload = {
        email: data.email,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        role_id: parseInt(data.role_id),
      };

      const endpoint = isEditing ? `/users/${user?.user_id}` : "/users/create";
      const method = isEditing ? "put" : "post";

      const { data: createdUser } = await axiosInstance[method](
        endpoint,
        userPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!isEditing && createdUser?.user_id) {
        if (roleName === "FORMATEUR") {
          const formData = new FormData();
          formData.append("user_id", createdUser.user_id);
          formData.append("files", data.cv_file as File);
          formData.append("files", data.badge_file as File);
          await createOrUpdateFormateur(token!, formData, false);
        }

        if (roleName === "PARTICIPANT") {
          await createOrUpdateParticipant(
            token!,
            {
              user_id: createdUser.user_id,
              entreprise: data.entreprise ?? "",
              poste: data.poste ?? "",
            },
            false
          );
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(`User ${isEditing ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await mutation.mutateAsync(data);
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
        <Tabs defaultValue="utilisateur" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="utilisateur">Utilisateur</TabsTrigger>
            <TabsTrigger value="formateur">Formateur</TabsTrigger>
            <TabsTrigger value="participant">Participant</TabsTrigger>
          </TabsList>
          <TabsContent value="utilisateur">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                          form.setValue(
                            "role_name",
                            selectedRole?.role_name || ""
                          );
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectionner un role">
                              {form.watch("role_name") ||
                                "Selectionner un role"}
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
                {!isEditing && roleName === "FORMATEUR" && (
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
                {!isEditing && roleName === "PARTICIPANT" && (
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
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
