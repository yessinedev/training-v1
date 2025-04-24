"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { fetchParticipants, assignParticipantsToFormation } from "@/services/participantService";
import { ActionFormationParticipant, Participant } from "@/types"; // Assuming Participant type exists
import { useAuthQuery } from "@/hooks/useAuthQuery";

type AssignExistingParticipantsDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formationId: number;
  assignedParticipants: ActionFormationParticipant[];
};

export default function AssignExistingParticipantsDialog({
  isOpen,
  onOpenChange,
  formationId,
  assignedParticipants = [],
}: AssignExistingParticipantsDialogProps) {
  const queryClient = useQueryClient();
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<Set<string>>(new Set());

  const { data: allParticipants, isLoading: isLoadingAll, error: errorAll } = useAuthQuery<Participant[]>(
    ["participants"], 
    fetchParticipants,
  );

  const availableParticipants = useMemo(() => {
    if (!allParticipants) return [];
    const assignedIds = new Set(assignedParticipants.map(p => p.participant_id));
    return allParticipants.filter(p => !assignedIds.has(p.user.user_id));
  }, [allParticipants, assignedParticipants]);

  const assignMutation = useMutation({
    mutationFn: (participantIds: string[]) =>
      assignParticipantsToFormation(formationId, participantIds),
    onSuccess: () => {
      toast.success("Participants assignés avec succès !");
      // Invalidate queries to refetch formation details (including participants)
      queryClient.invalidateQueries({ queryKey: ["action-formation", formationId] });
      queryClient.invalidateQueries({ queryKey: ["formation-participants", formationId] }); // If you have a specific query for this
      handleClose(); // Close dialog on success
    },
    onError: (error: unknown) => {
      toast.error(`Échec de l'assignation: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    },
  });

  const handleCheckboxChange = (participantId: string, checked: boolean | string) => {
    setSelectedParticipantIds(prev => {
      const newSet = new Set(prev);
      if (checked === true) {
        newSet.add(participantId);
      } else {
        newSet.delete(participantId);
      }
      return newSet;
    });
  };

  const handleAssign = () => {
    if (selectedParticipantIds.size === 0) {
      toast.warning("Veuillez sélectionner au moins un participant.");
      return;
    }
    assignMutation.mutate(Array.from(selectedParticipantIds));
  };

  const handleClose = () => {
    setSelectedParticipantIds(new Set()); // Reset selection on close
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assigner des Participants Existants</DialogTitle>
          <DialogDescription>
            Sélectionnez les participants à ajouter à cette session de formation.
          </DialogDescription>
        </DialogHeader>

        {isLoadingAll && <p>Chargement des participants...</p>}
        {errorAll && <p className="text-red-500">Erreur de chargement des participants.</p>}

        {!isLoadingAll && !errorAll && (
          <>
            {availableParticipants.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucun participant disponible à assigner.
              </p>
            ) : (
              <ScrollArea className="h-[300px] border rounded-md p-4">
                <div className="space-y-4">
                  {availableParticipants.map((participant) => (
                    <div key={participant.user.user_id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`participant-${participant.user.user_id}`}
                        checked={selectedParticipantIds.has(participant.user.user_id)}
                        onCheckedChange={(checked) => handleCheckboxChange(participant.user.user_id, checked)}
                        disabled={assignMutation.isPending}
                      />
                      <Label htmlFor={`participant-${participant.user.user_id}`} className="flex-grow cursor-pointer">
                        {participant.user.prenom} {participant.user.nom} ({participant.user.email})
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={assignMutation.isPending}>
            Annuler
          </Button>
          <Button
            onClick={handleAssign}
            disabled={isLoadingAll || selectedParticipantIds.size === 0 || assignMutation.isPending}
          >
            {assignMutation.isPending ? "Assignation..." : "Assigner Sélectionnés"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}