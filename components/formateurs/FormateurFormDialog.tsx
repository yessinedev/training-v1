import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Formateur } from "@/types";
import FormateurForm from "./formateur-form";

type FormateurFormProps = {
  formateur?: Formateur;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const FormateurFormDialog = ({
  formateur,
  isOpen,
  onOpenChange,
}: FormateurFormProps) => {
  const isEditing = !!formateur;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le Formateur" : "Créer nouveau Formateur"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifier les informations du formateur et cliquer sur le bouton de sauvgarde"
              : "Créer un nouveau formateur et cliquer sur le bouton de sauvgarde"}
          </DialogDescription>
        </DialogHeader>
        <FormateurForm formateur={formateur} />
      </DialogContent>
    </Dialog>
  );
};

export default FormateurFormDialog;
