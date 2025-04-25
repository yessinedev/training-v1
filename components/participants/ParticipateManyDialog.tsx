"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Formation } from "@/types";
import { format } from "date-fns";
import { fetchFormations } from "@/services/formationService";
import { assignParticipantsToFormation } from "@/services/participantService";

export type ParticipateManyDialogProps = {
  isOpen: boolean;
  participantsIds: string[];
  onOpenChange: (open: boolean) => void;
};

export function ParticipateManyDialog({
  isOpen,
  participantsIds,
  onOpenChange,
}: ParticipateManyDialogProps) {
  const [selectedFormation, setSelectedFormation] = useState<string>("");

  const {
    data: formations,
    isLoading,
    isError,
  } = useQuery<Formation[]>({
    queryKey: ["formations"],
    queryFn: fetchFormations,
  });

  const mutation = useMutation({
    mutationFn: ({
      formationId,
      participants,
    }: {
      formationId: string;
      participants: string[];
    }) => assignParticipantsToFormation(Number(formationId), participants),
    onSuccess: () => {
      onOpenChange(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = () => {
    if (!selectedFormation) {
      return;
    }

    mutation.mutate({
      formationId: selectedFormation,
      participants: participantsIds,
    });
  };

  const formatDate = (isoString: Date): string => {
    return ` ${format(isoString, "dd/MM/yyyy")} `;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Participants to Formation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Select
              value={selectedFormation}
              onValueChange={setSelectedFormation}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a formation" />
              </SelectTrigger>
              <SelectContent>
                {formations &&
                  formations.map((formation) => (
                    <SelectItem
                      key={formation.action_id}
                      value={formation.action_id.toString()}
                    >
                      {formation.theme?.libelle_theme}{" "}
                      {`${formatDate(formation.date_debut)}-${formatDate(
                        formation.date_fin
                      )}`}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Adding participants..." : "Add to Formation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
