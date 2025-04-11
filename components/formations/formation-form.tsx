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
  type_action: z.string().min(1, "Type is required"),
  theme_id: z.string().min(1, "Theme is required"),
  date_debut: z.string().min(1, "Start date is required"),
  date_fin: z.string().min(1, "End date is required"),
  duree_jours: z.number().min(1, "Duration in days is required"),
  duree_heures: z.string().min(1, "Duration in hours is required"),
  lieu: z.string().min(1, "Location is required"),
  nb_participants_prevu: z
    .string()
    .min(1, "Number of participants is required"),
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
      lieu: "",
      nb_participants_prevu: "",
      user_id: "",
    },
  });

  const startDate = form.watch("date_debut");
  const endDate = form.watch("date_fin");

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Add +1 if you want inclusive counting (same day = 1 day)
      form.setValue("duree_jours", diffDays + 1);
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
        duree_jours: formation.duree_jours.toString(),
        duree_heures: formation.duree_heures.toString(),
        lieu: formation.lieu,
        nb_participants_prevu: formation.nb_participants_prevu.toString(),
        user_id: formation.formateurs[0]?.formateur_id.toString() || "",
      });
    }
  }, [formation, isOpen, form]);

  const { data: themes } = useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const response = await axiosInstance.get("/themes");
      return response.data;
    },
  });

  const { data: formateurs } = useQuery({
    queryKey: ["formateurs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/formateurs");
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload = {
        ...data,
        theme_id: parseInt(data.theme_id),
        duree_jours: parseInt(data.duree_jours),
        duree_heures: parseInt(data.duree_heures),
        nb_participants_prevu: parseInt(data.nb_participants_prevu),
        user_id: data.user_id ? data.user_id : undefined,
      };

      console.log(payload);

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
        `Formation ${isEditing ? "updated" : "created"} successfully`
      );
      onClose();
    },
    onError: (error: Error) => {
      toast.error(
        `Failed to ${isEditing ? "update" : "create"} formation: ${
          error.message
        }`
      );
      console.error(
        `Error ${isEditing ? "updating" : "creating"} formation:`,
        error
      );
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier la session" : "Nouvelle session"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Mettez à jour les informations de la session et cliquez sur le bouton de mise à jour"
              : "Entrez les informations de la session et cliquez sur le bouton enregistrer"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type_action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type de session" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="presentielle">Presentielle</SelectItem>
                      <SelectItem value="distance">A distance</SelectItem>
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
                  <FormLabel>Theme</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner le theme" />
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date_debut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                      <Input type="date" {...field} />
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
                    <FormLabel>Duration (Days)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" readOnly {...field} />
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
                    <FormLabel>Duration (Hours)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="lieu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Max Participants</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
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
                  <FormLabel>Trainer</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trainer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {formateurs?.map((formateur: Formateur) => (
                        <SelectItem
                          key={formateur.user_id}
                          value={formateur.user_id.toString()}
                        >
                          {formateur.user.prenom} {formateur.user.nom}
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

export default FormationForm;
