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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Role, Participant } from "@/types";
import {
  assignParticipantsToFormation,
  createParticipant,
  updateParticipant,
} from "@/services/participantService";
import { fetchRoles } from "@/services/roleService";

// Schema definition
const formSchema = z.object({
  nom: z.string().min(1, "Last name is required").max(100),
  prenom: z.string().min(1, "First name is required").max(100),
  email: z.string().email("Invalid email address"),
  telephone: z.string().min(1, "Phone number is required"),
  entreprise: z.string().min(1, "Company is required"),
  poste: z.string().min(1, "Position is required"),
});

type FormValues = z.infer<typeof formSchema>;

type ParticipantFormProps = {
  participant?: Participant;
  formationId?: number;
};

export const ParticipantForm = ({
  participant,
  formationId,
}: ParticipantFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const isEditing = !!participant;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: participant
      ? {
          nom: participant.user.nom,
          prenom: participant.user.prenom,
          email: participant.user.email,
          telephone: participant.user.telephone,
          entreprise: participant.entreprise,
          poste: participant.poste,
        }
      : {
          nom: "",
          prenom: "",
          email: "",
          telephone: "",
          entreprise: "",
          poste: "",
        },
  });

  useEffect(() => {
    if (participant) {
      form.reset({
        nom: participant.user.nom,
        prenom: participant.user.prenom,
        email: participant.user.email,
        telephone: participant.user.telephone,
        entreprise: participant.entreprise,
        poste: participant.poste,
      });
    } else {
      form.reset({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        entreprise: "",
        poste: "",
      });
    }
  }, [participant, form]);

  const { data: roles, isLoading: rolesLoading } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    enabled: !isEditing,
  });

  const createParticipantMutation = useMutation({
    mutationFn: async (data: FormValues): Promise<Participant> => {
      const participantRole = roles?.find((r) => r.role_name === "PARTICIPANT");
      if (!participantRole) {
        throw new Error("Le role 'PARTICIPANT' est introuvable.");
      }
      const userParticipantPayload = {
        email: data.email,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        entreprise: data.entreprise,
        poste: data.poste,
        role_id: participantRole.role_id,
      };
      const response = await createParticipant([userParticipantPayload]);
      return response.data || response;
    },
  });

  const updateParticipantMutation = useMutation({
    mutationFn: async (data: FormValues): Promise<Participant> => {
      if (!participant)
        throw new Error("Le participant à mettre à jour est introuvable.");
      const participantId = participant.user.user_id;
      const userParticipantPayload = {
        email: data.email,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        entreprise: data.entreprise,
        poste: data.poste,
        role_id: participant.user.role_id,
      };
      const response = await updateParticipant(
        participantId,
        userParticipantPayload
      );
      return response.data || response;
    },
  });

  const assignToFormationMutation = useMutation({
    mutationFn: async ({ participantId }: { participantId: string }) => {
      if (!formationId)
        throw new Error("Formation ID is missing for assignment.");
      await assignParticipantsToFormation(formationId, [participantId]);
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      let submittedParticipant: Participant | undefined;

      if (isEditing) {
        if (!participant)
          throw new Error("Participant data is missing for update.");
        submittedParticipant = await updateParticipantMutation.mutateAsync(
          data
        );
      } else {
        submittedParticipant = await createParticipantMutation.mutateAsync(
          data
        );
        console.log("Created: ", submittedParticipant);
      }

      if (formationId && submittedParticipant?.user?.user_id) {
        console.log("Invoked assigning");
        await assignToFormationMutation.mutateAsync({
          participantId: submittedParticipant.user.user_id,
        });
        queryClient.invalidateQueries({
          queryKey: ["formation-participants", formationId],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["participants"] });

      toast.success(
        `Participant ${isEditing ? "updated" : "created"} successfully`
      );
    } catch (error) {
      console.error("Form submission error:", error);
      const action = isEditing ? "update" : "create";
      toast.error(
        `Failed to ${action} participant: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="prenom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prenom</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Prenom du participant"
                    {...field}
                    value={field.value ?? ""}
                    disabled={isLoading}
                  />
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
                  <Input
                    placeholder="Nom du participant"
                    {...field}
                    value={field.value ?? ""}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                  disabled={isLoading || isEditing}
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
              <FormLabel>Telephone</FormLabel>
              <FormControl>
                <Input
                  placeholder="Numero de telephone"
                  {...field}
                  value={field.value ?? ""}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="entreprise"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entreprise</FormLabel>
              <FormControl>
                <Input
                  placeholder="Exp: ABC Corp"
                  {...field}
                  value={field.value ?? ""}
                  disabled={isLoading}
                />
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
                  placeholder="Poste de travail"
                  {...field}
                  value={field.value ?? ""}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" disabled={isLoading}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading || rolesLoading}>
            {isLoading
              ? isEditing
                ? "Mise à jour..."
                : "Enregistrement..."
              : isEditing
              ? "Mettre à jour"
              : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
