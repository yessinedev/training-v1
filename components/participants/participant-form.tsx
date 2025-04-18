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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Role } from "@/types";
import { createUserParticipant } from "@/services/participantService";

const formSchema = z.object({
  nom: z.string().min(1, "Last name is required").max(100),
  prenom: z.string().min(1, "First name is required").max(100),
  email: z.string().email(),
  telephone: z.string(),
  entreprise: z.string(),
  poste: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

type ParticipantFormProps = {
  isOpen: boolean;
  formationId?: number;
  onOpenChange: (open: boolean) => void;
};

const ParticipantForm = ({
  isOpen,
  formationId,
  onOpenChange,
}: ParticipantFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      entreprise: "",
      poste: "",
    },
  });

  useEffect(() => {
    form.reset({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      entreprise: "",
      poste: "",
    });
  }, [isOpen, form]);
  const { data: roles } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await axiosInstance.get("/roles");
      return response.data;
    },
  });

  const createParticipantMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const participantRole = roles?.find((r) => r.role_name === "PARTICIPANT");
      const userParticipantPayload = {
        email: data.email,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        entreprise: data.entreprise,
        poste: data.poste,
        role_id: participantRole?.role_id!,
      };
      const response = await createUserParticipant(userParticipantPayload);
      return response.data;
    },
  });

  const assignToFormationMutation = useMutation({
    mutationFn: async ({ participantId }: { participantId: number }) => {
      const response = await axiosInstance.post(
        `/formations/${formationId}/participants`,
        {
          participant_id: participantId,
          statut: "Confirmé",
        }
      );
      return response.data;
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);

      const newParticipant = await createParticipantMutation.mutateAsync(data);

      if (formationId) {
        await assignToFormationMutation.mutateAsync({
          participantId: newParticipant.user_id,
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["formation-participants", formationId],
      });
      toast.success(`Participant created successfully`);
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        `Failed to create participant: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Participant</DialogTitle>
          <DialogDescription>
            Enter the participant information and click the save button
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                      onChange={(e) => field.onChange(e.target.value || null)}
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
                      onChange={(e) => field.onChange(e.target.value || null)}
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
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Company"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
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
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Position"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantForm;
