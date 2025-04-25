'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createAttestation } from "@/services/attestationService";

type GenerateAttestationsDialogProps = {
  formationId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  participants: any[];
};

export default function GenerateAttestationsDialog({
  formationId,
  isOpen,
  onOpenChange,
  participants,
}: GenerateAttestationsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const pendingAttestations = participants.filter(
    (p) => p.statut === "Confirmé" && !p.attestation
  );

  const mutation = useMutation({
    mutationFn: () => createAttestation(formationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formation", formationId] });
      toast.success("Attestations generated successfully");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate attestations: ${error.message}`);
    },
  });

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      await mutation.mutateAsync();
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Attestations</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Generate attestations for all confirmed participants who have completed
            the training session.
          </p>
          <div className="rounded-lg border p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Summary</p>
              <ul className="text-sm text-muted-foreground">
                <li>Total participants: {participants.length}</li>
                <li>
                  Pending attestations: {pendingAttestations.length}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isLoading || pendingAttestations.length === 0}
          >
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}