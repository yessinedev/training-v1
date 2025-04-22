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
import { Formation, Theme, Formateur } from "@/types";

const formSchema = z.object({
  type_action: z.string().min(1, "Le type est requis"),
  theme_id: z.string().min(1, "Le thème est requis"),
  date_debut: z.string().min(1, "La date de début est requise"),
  date_fin: z.string().min(1, "La date de fin est requise"),
  duree_jours: z.number().min(1, "La durée en jours est requise"),
  duree_heures: z.string().min(1, "La durée en heures est requise"),
  prix_unitaire: z.string().optional(),
  lieu: z.string().min(1, "Le lieu est requis"),
  nb_participants_prevu: z
    .string()
    .min(1, "Le nombre de participants est requis"),
  user_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type FormationFormProps = {
  formation?: Formation;
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
};

const FormationForm = ({
  formation,
  isOpen,
  onClose,
  onOpenChange,
}: FormationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!formation;
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type_action: "",
      theme_id: "",
      date_debut: "",
      date_fin: "",
      duree_jours: 1,
      duree_heures: "",
      prix_unitaire: "",
      lieu: "",
      nb_participants_prevu: "",
      user_id: "",
    },
  });

  const startDate = form.watch("date_debut");
  const endDate = form.watch("date_fin");

  useEffect(() => {
    if (startDate && endDate) {
      try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          form.setValue("duree_jours", diffDays);
        } else if (end < start) {
          form.setValue("duree_jours", 1);
        } else {
          form.setValue("duree_jours", 1);
        }
      } catch (e) {
        console.error("Error calculating date difference:", e);
        form.setValue("duree_jours", 1);
      }
    } else {
      form.setValue("duree_jours", 1);
    }
  }, [startDate, endDate, form]);

  useEffect(() => {
    if (isOpen && formation) {
      form.reset({
        type_action: formation.type_action,
        theme_id: formation.theme_id.toString(),
        date_debut: new Date(formation.date_debut).toISOString().split("T")[0],
        date_fin: new Date(formation.date_fin).toISOString().split("T")[0],
        duree_heures: formation.duree_heures.toString(),
        prix_unitaire: formation.prix_unitaire?.toString() ?? "",
        lieu: formation.lieu,
        nb_participants_prevu: formation.nb_participants_prevu.toString(),
        user_id: formation.formateurs?.[0]?.formateur_id.toString() || "",
      });
    } else if (!isOpen) {
      form.reset({
        type_action: "",
        theme_id: "",
        date_debut: "",
        date_fin: "",
        duree_jours: 1,
        duree_heures: "",
        prix_unitaire: "",
        lieu: "",
        nb_participants_prevu: "",
        user_id: "",
      });
    }
  }, [formation, isOpen, form]);

  const { data: themes, isLoading: themesLoading } = useQuery<Theme[]>({
    queryKey: ["themes"],
    queryFn: async () => {
      const response = await axiosInstance.get("/themes");
      return response.data;
    },
  });

  const { data: formateurs, isLoading: formateursLoading } = useQuery<
    Formateur[]
  >({
    queryKey: ["formateurs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/formateurs");
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload = {
        type_action: data.type_action,
        theme_id: parseInt(data.theme_id, 10),
        date_debut: data.date_debut,
        date_fin: data.date_fin,
        duree_jours: data.duree_jours,
        duree_heures: parseInt(data.duree_heures, 10),
        prix_unitaire: data.prix_unitaire
          ? parseFloat(data.prix_unitaire)
          : undefined,
        lieu: data.lieu,
        nb_participants_prevu: parseInt(data.nb_participants_prevu, 10),
        user_id: data.user_id ? parseInt(data.user_id, 10) : undefined,
      };

      if (isNaN(payload.theme_id)) throw new Error("ID de thème invalide.");
      if (isNaN(payload.duree_heures))
        throw new Error("Durée en heures invalide.");
      if (payload.prix_unitaire !== undefined && isNaN(payload.prix_unitaire))
        throw new Error("Prix unitaire invalide.");
      if (isNaN(payload.nb_participants_prevu))
        throw new Error("Nombre de participants invalide.");
      

      console.log("Payload:", payload);

      if (isEditing && formation) {
        const response = await axiosInstance.put(`/formations`, {
          action_id: formation.action_id,
          ...payload,
        });
        return response.data;
      } else {
        const response = await axiosInstance.post("/formations", payload);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formations"] });
      toast.success(
        `Session ${isEditing ? "mise à jour" : "créée"} avec succès`
      );
      onClose();
    },
    onError: (error: unknown) => {
      let errorMessage = "Une erreur inconnue est survenue.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(
        `Échec de ${
          isEditing ? "la mise à jour" : "la création"
        } de la session: ${errorMessage}`
      );
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (new Date(data.date_fin) < new Date(data.date_debut)) {
      toast.error(
        "La date de fin ne peut pas être antérieure à la date de début."
      );
      return;
    }
    setIsLoading(true);
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error("Erreur de soumission du formulaire interceptée:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier la session" : "Nouvelle session"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Mettez à jour les informations de la session et cliquez sur Mettre à jour."
              : "Entrez les informations de la nouvelle session et cliquez sur Enregistrer."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type_action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="presentielle">
                          Présentielle
                        </SelectItem>
                        <SelectItem value="distance">À distance</SelectItem>
                        <SelectItem value="hybride">Hybride</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="theme_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thème</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading || themesLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le thème" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {themes?.map((theme: Theme) => (
                          <SelectItem
                            key={theme.theme_id}
                            value={theme.theme_id.toString()}
                          >
                            {theme.libelle_theme}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date_debut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_fin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duree_jours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée (Jours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        readOnly
                        {...field}
                        value={field.value || 1}
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duree_heures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée (Heures)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        step="0.5"
                        placeholder="ex: 7"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lieu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ex: Salle A, En ligne"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nb_participants_prevu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nb. Participants Max</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="ex: 12"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prix_unitaire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix Unitaire (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="ex: 1500.00"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Formateur</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading || formateursLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un formateur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {formateurs?.map((formateur: Formateur) => (
                          <SelectItem
                            key={formateur.user?.user_id}
                            value={formateur.user?.user_id.toString()}
                          >
                            {formateur.user?.prenom} {formateur.user?.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  themesLoading ||
                  formateursLoading ||
                  mutation.isPending
                }
              >
                {isLoading || mutation.isPending
                  ? "Enregistrement..."
                  : isEditing
                  ? "Mettre à jour"
                  : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FormationForm;
