'use client';

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
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
import { Participant, Formation } from "@/types";

const formSchema = z.object({
  nom: z.string().min(1, "Last name is required").max(100),
  prenom: z.string().min(1, "First name is required").max(100),
  email: z.string().email().optional().nullable(),
  telephone: z.string().optional().nullable(),
  entreprise: z.string().optional().nullable(),
  poste: z.string().optional().nullable(),
  action_id: z.string().optional(),
  statut: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type ParticipantFormProps = {
  participant?: Participant;
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
};

const ParticipantForm = ({ participant, isOpen, onClose, onOpenChange }: ParticipantFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!participant;
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
      action_id: "",
      statut: "",
    },
  });

  const { data: formations } = useQuery({
    queryKey: ["formations"],
    queryFn: async () => {
      const response = await axiosInstance.get("/formations");
      return response.data;
    },
  });

  useEffect(() => {
    if (isOpen && participant) {
      form.reset({
        nom: participant.nom,
        prenom: participant.prenom,
        email: participant.email ?? "",
        telephone: participant.telephone ?? "",
        entreprise: participant.entreprise ?? "",
        poste: participant.poste ?? "",
      });
    } else {
      form.reset({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        entreprise: "",
        poste: "",
        action_id: "",
        statut: "",
      });
    }
  }, [participant, isOpen, form]);

  const createParticipantMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await axiosInstance.post("/participants", {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email || null,
        telephone: data.telephone || null,
        entreprise: data.entreprise || null,
        poste: data.poste || null,
      });
      return response.data;
    },
  });

  const assignToFormationMutation = useMutation({
    mutationFn: async ({ participantId, actionId, status }: { participantId: number; actionId: number; status: string }) => {
      const response = await axiosInstance.post(`/formations/${actionId}/participants`, {
        participant_id: participantId,
        statut: status,
      });
      return response.data;
    },
  });

  const updateParticipantMutation = useMutation({
    mutationFn: async (data: FormValues & { participant_id: number }) => {
      const response = await axiosInstance.put("/participants", {
        participant_id: data.participant_id,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email || null,
        telephone: data.telephone || null,
        entreprise: data.entreprise || null,
        poste: data.poste || null,
      });
      return response.data;
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);

      if (isEditing && participant) {
        await updateParticipantMutation.mutateAsync({
          ...data,
          participant_id: participant.participant_id,
        });
      } else {
        const newParticipant = await createParticipantMutation.mutateAsync(data);

        if (data.action_id && data.statut) {
          await assignToFormationMutation.mutateAsync({
            participantId: newParticipant.participant_id,
            actionId: parseInt(data.action_id),
            status: data.statut,
          });
        }
      }

      queryClient.invalidateQueries({ queryKey: ["participants"] });
      toast.success(`Participant ${isEditing ? "updated" : "created"} successfully`);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(`Failed to ${isEditing ? "update" : "create"} participant: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Participant" : "Add New Participant"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the participant information and click the update button"
              : "Enter the participant information and click the save button"}
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
                      <Input placeholder="Last Name" {...field} value={field.value ?? ""} />
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
                      <Input placeholder="First Name" {...field} value={field.value ?? ""} />
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

            {!isEditing && (
              <>
                <FormField
                  control={form.control}
                  name="action_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formation</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select formation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formations?.map((formation: Formation) => (
                            <SelectItem
                              key={formation.action_id}
                              value={formation.action_id.toString()}
                            >
                              {formation.type_action} - {formation.lieu} ({format(new Date(formation.date_debut), 'dd/MM/yyyy')})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="statut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Confirmé">Confirmed</SelectItem>
                          <SelectItem value="En attente">Pending</SelectItem>
                          <SelectItem value="Liste d'attente">Waitlist</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : isEditing ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantForm;