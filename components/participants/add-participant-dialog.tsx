"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Participant } from "@/types";
import { fetchParticipants } from "@/services/participantService";
import { updateParticipantStatus } from "@/services/formationService";

const formSchema = z.object({
  participant_id: z.string().min(1, "Participant is required"),
  statut: z.string().min(1, "Status is required"),
});

type FormValues = z.infer<typeof formSchema>;

type AddParticipantDialogProps = {
  formationId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddParticipantDialog({
  formationId,
  isOpen,
  onOpenChange,
}: AddParticipantDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      participant_id: "",
      statut: "",
    },
  });

  const { data: participants } = useQuery({
    queryKey: ["participants"],
    queryFn: fetchParticipants,
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      updateParticipantStatus(
        { participant_id: data.participant_id, statut: data.statut },
        formationId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formation", formationId] });
      toast.success("Participant ajouté avec succès !");
      form.reset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Participant</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="participant_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participant</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select participant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {participants?.map((participant: Participant) => (
                        <SelectItem
                          key={participant.user_id}
                          value={participant.user_id}
                        >
                          {participant.user.prenom} {participant.user.nom} -{" "}
                          {participant.entreprise}
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Confirmé">Confirmé</SelectItem>
                      <SelectItem value="En attente">En attente</SelectItem>
                      <SelectItem value="Liste d'attente">
                        {"Liste d'attente"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Participant"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
