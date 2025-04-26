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
import { Domain, Theme } from "@/types";
import { fetchDomaines } from "@/services/domaineService";
import {
  createTheme,
  ThemePayload,
  updateTheme,
} from "@/services/themeService";

const formSchema = z.object({
  libelle_theme: z
    .string()
    .min(1, "Theme name is required")
    .max(100, "Theme name must be less than 100 characters"),
  domaine_id: z.string().min(1, "Domain is required"),
});

type FormValues = z.infer<typeof formSchema>;

type ThemeFormProps = {
  theme?: Theme;
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
};

const ThemeForm = ({
  theme,
  isOpen,
  onClose,
  onOpenChange,
}: ThemeFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!theme;
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      libelle_theme: "",
      domaine_id: "",
    },
  });

  const { data: domains } = useQuery({
    queryKey: ["domaines"],
    queryFn: fetchDomaines,
  });

  useEffect(() => {
    if (isOpen && theme) {
      form.reset({
        libelle_theme: theme.libelle_theme,
        domaine_id: theme.domaine_id.toString(),
      });
    }
  }, [theme, isOpen, form]);

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload: ThemePayload = {
        ...data,
        domaine_id: parseInt(data.domaine_id),
      };

      if (isEditing && theme) {
        await updateTheme(theme.theme_id, payload);
      } else {
        await createTheme(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      toast.success(`Theme ${isEditing ? "Modifier" : "Créer"} avec succès`);
      onClose();
    },
    onError: (error: Error) => {
      toast.error(
        `Erreur lors de la ${isEditing ? "modification" : "création"} du theme: ${error.message}`
      );
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      await mutation.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier Théme" : "Créer Théme"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Mettre à jour les informations du thème et cliquer sur le bouton de mise à jour"
              : "Créer un nouveau thème en remplissant le formulaire et en cliquant sur le bouton Enregistrer"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="libelle_theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Libelle Theme</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrer le libelle de theme" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domaine_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domaine</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner un domaine" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {domains?.map((domain: Domain) => (
                        <SelectItem
                          key={domain.domaine_id}
                          value={domain.domaine_id.toString()}
                        >
                          {domain.libelle_domaine}
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
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Création..." : isEditing ? "Modifer" : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeForm;
