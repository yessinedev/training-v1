"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Role } from "@/types";
import { fetchRoles } from "@/services/roleService";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { createUser, updateUser } from "@/services/userService";

export const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  nom: z.string().min(1, "Last name is required").max(100),
  prenom: z.string().min(1, "First name is required").max(100),
  telephone: z.string().min(1, "Phone number is required"),
  role_id: z.string().min(1, "Role is required"),
});

export type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  initialValues?: UserFormValues & { user_id: string };
}

export default function UserForm({ initialValues }: UserFormProps) {
  const queryClient = useQueryClient();

  // Fetch roles
  const { data: allRoles = [], isLoading: rolesLoading } = useAuthQuery<Role[]>(
    ["roles"],
    fetchRoles
  );

  // Filter as needed
  const filteredRoles = allRoles?.filter(
    (r) => r.role_name === "ADMIN" || r.role_name === "GESTIONNAIRE"
  );

  const saveMutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      const payload = {
        email: values.email,
        nom: values.nom,
        prenom: values.prenom,
        telephone: values.telephone,
        role_id: parseInt(values.role_id, 10),
      };
      if (initialValues) {
        console.log("updating user", {...values, role_id: parseInt(values.role_id)});
        await updateUser(initialValues.user_id, {...values, role_id: parseInt(values.role_id)});
      } else {
        await createUser(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(
        `Utilisateur ${initialValues ? "modifier" : "créer"} avec succès`
      );
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message);
    },
  });

  // Form setup
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues ?? {
      email: "",
      nom: "",
      prenom: "",
      telephone: "",
      role_id: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((vals) => saveMutation.mutate(vals))}
        className="space-y-4"
      >
        {/* Email, Nom, Prenom, Telephone */}
        {(["email", "nom", "prenom", "telephone"] as const).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field}
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    value={value}
                    onChange={onChange}
                    placeholder={field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* Role selector */}
        <FormField
          control={form.control}
          name="role_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredRoles.map((r) => (
                      <SelectItem key={r.role_id} value={r.role_id.toString()}>
                        {r.role_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            type="reset"
            onClick={() => form.reset(initialValues ?? undefined)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending
              ? initialValues
                ? "Updating…"
                : "Creating…"
              : initialValues
              ? "Save Changes"
              : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
