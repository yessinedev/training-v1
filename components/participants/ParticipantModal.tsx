"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Participant } from "@/types";
import { ParticipantForm } from "./participant-form";

type ParticipantModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  participant?: Participant; 
  formationId?: number; 
};

export const ParticipantModal = ({
  isOpen,
  onOpenChange,
  participant,
  formationId,
}: ParticipantModalProps) => {
  const isEditing = !!participant;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le participant" : "Ajouter un nouveau participant"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifier les informations du participant."
              : "Entrer les informations du nouveau participant."}
          </DialogDescription>
        </DialogHeader>
        <ParticipantForm
          participant={participant}
          formationId={formationId}
        />
      </DialogContent>
    </Dialog>
  );
};