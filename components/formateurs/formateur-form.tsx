"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Formateur, Role } from "@/types";
import { useFormateurMutation } from "@/hooks/useFormateurMutation";
import FileInput from "../FileInput";
import { Input } from "../ui/input";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { fetchRoles } from "@/services/roleService";

const formSchema = z.object({
  nom: z.string().min(1, "Last name is required").max(100),
  prenom: z.string().min(1, "First name is required").max(100),
  email: z.string().email(),
  telephone: z.string(),
  tarif_heure: z.string().optional(),
  tarif_jour: z.string().optional(),
  tarif_seance: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type TarifType = "heure" | "jour" | "seance";

type FormateurFormProps = {
  formateur?: Formateur;
};

const FormateurForm = ({ formateur }: FormateurFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [badgeFile, setBadgeFile] = useState<File | null>(null);
  const [selectedTarifType, setSelectedTarifType] = useState<TarifType | null>(
    null
  );
  const isEditing = !!formateur;
  const queryClient = useQueryClient();

  const { data: roles = [], isLoading: rolesLoading } = useAuthQuery<Role[]>(
    ["roles"],
    fetchRoles
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      tarif_heure: "",
      tarif_jour: "",
      tarif_seance: "",
    },
  });

  useEffect(() => {
    if (formateur) {
      let initialTarifType: TarifType | null = null;
      if (formateur.tarif_heure) initialTarifType = "heure";
      else if (formateur.tarif_jour) initialTarifType = "jour";
      else if (formateur.tarif_seance) initialTarifType = "seance";
      setSelectedTarifType(initialTarifType);

      form.reset({
        nom: formateur.user.nom,
        prenom: formateur.user.prenom,
        email: formateur.user.email,
        telephone: formateur.user.telephone,
        tarif_heure: formateur.tarif_heure?.toString() ?? "",
        tarif_jour: formateur.tarif_jour?.toString() ?? "",
        tarif_seance: formateur.tarif_seance?.toString() ?? "",
      });
    } else {
      form.reset({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        tarif_heure: "",
        tarif_jour: "",
        tarif_seance: "",
      });
      setSelectedTarifType(null);
      setCvFile(null);
      setBadgeFile(null);
    }
  }, [formateur, form]);

  const mutation = useFormateurMutation(
    isEditing,
    () => {
      queryClient.invalidateQueries({ queryKey: ["formateurs"] });
      toast.success(
        `Formateur ${isEditing ? "updated" : "created"} successfully`
      );
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

  const handleTarifTypeChange = (value: string) => {
    const newTarifType = value as TarifType;
    setSelectedTarifType(newTarifType);
    if (newTarifType !== "heure") form.setValue("tarif_heure", "");
    if (newTarifType !== "jour") form.setValue("tarif_jour", "");
    if (newTarifType !== "seance") form.setValue("tarif_seance", "");
  };

  const onSubmit = async (values: FormValues) => {
    const formateurRole = roles.find((role) => role.role_name === "FORMATEUR");
    if (!formateurRole && !isEditing) {
      toast.error("FORMATEUR role not found. Cannot create formateur.");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();

      formData.append("nom", values.nom);
      formData.append("prenom", values.prenom);
      formData.append("email", values.email);
      formData.append("telephone", values.telephone);

      if (!isEditing && formateurRole) {
        formData.append("role_id", formateurRole.role_id.toString());
      }

      if (selectedTarifType === "heure" && values.tarif_heure) {
        formData.append("tarif_heure", values.tarif_heure);
      } else if (selectedTarifType === "jour" && values.tarif_jour) {
        formData.append("tarif_jour", values.tarif_jour);
      } else if (selectedTarifType === "seance" && values.tarif_seance) {
        formData.append("tarif_seance", values.tarif_seance);
      }

      if (cvFile) {
        formData.append("CV", cvFile);
      }
      if (badgeFile) {
        formData.append("BADGE", badgeFile);
      }

      if (isEditing && formateur?.user.user_id) {
        formData.append("user_id", formateur.user.user_id.toString());
      }

      await mutation.mutateAsync(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (formateur) {
      let initialTarifType: TarifType | null = null;
      if (formateur.tarif_heure) initialTarifType = "heure";
      else if (formateur.tarif_jour) initialTarifType = "jour";
      else if (formateur.tarif_seance) initialTarifType = "seance";
      setSelectedTarifType(initialTarifType);
      form.reset({
        nom: formateur.user.nom,
        prenom: formateur.user.prenom,
        email: formateur.user.email,
        telephone: formateur.user.telephone,
        tarif_heure: formateur.tarif_heure?.toString() ?? "",
        tarif_jour: formateur.tarif_jour?.toString() ?? "",
        tarif_seance: formateur.tarif_seance?.toString() ?? "",
      });
    } else {
      form.reset({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        tarif_heure: "",
        tarif_jour: "",
        tarif_seance: "",
      });
      setSelectedTarifType(null);
    }
    setCvFile(null);
    setBadgeFile(null);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Last Name"
                  {...field}
                  value={field.value ?? ""}
                />
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
                <Input
                  placeholder="First Name"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
                  {...field}
                  value={field.value ?? ""}
                />
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
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  placeholder="Phone"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem className="space-y-3">
          <FormLabel>Select Tarif Type</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={handleTarifTypeChange}
              value={selectedTarifType ?? ""}
              className="flex space-x-4"
            >
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <RadioGroupItem value="heure" />
                </FormControl>
                <FormLabel className="font-normal">Hourly</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <RadioGroupItem value="jour" />
                </FormControl>
                <FormLabel className="font-normal">Daily</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <RadioGroupItem value="seance" />
                </FormControl>
                <FormLabel className="font-normal">Session</FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>

        {selectedTarifType === "heure" && (
          <FormField
            control={form.control}
            name="tarif_heure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Rate (€)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter hourly rate"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {selectedTarifType === "jour" && (
          <FormField
            control={form.control}
            name="tarif_jour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Daily Rate (€)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter daily rate"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {selectedTarifType === "seance" && (
          <FormField
            control={form.control}
            name="tarif_seance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Rate (€)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter session rate"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex flex-row space-x-4 items-start">
          <FormItem className="flex-1">
            <FileInput
              accept=".pdf,.doc,.docx"
              label="CV Document"
              onChange={(e) =>
                e.target.files?.[0] && setCvFile(e.target.files[0])
              }
            />
          </FormItem>
          <FormItem className="flex-1">
            <FileInput
              accept="image/*"
              label="Badge Photo"
              onChange={(e) =>
                e.target.files?.[0] && setBadgeFile(e.target.files[0])
              }
            />
          </FormItem>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || mutation.isPending || rolesLoading}>
            {isLoading || mutation.isPending
              ? "Saving..."
              : isEditing
              ? "Update"
              : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormateurForm;
