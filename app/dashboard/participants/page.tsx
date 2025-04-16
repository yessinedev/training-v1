"use client";
import { Button } from "@/components/ui/button";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCallback, useMemo, useState } from "react";
import { ParticipateManyDialog } from "@/components/participants/ParticipateManyDialog";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import {
  deleteParticipant,
  fetchParticipants,
} from "@/services/participantService";
import { useAuthMutation } from "@/hooks/useAuthMutation";
import { getParticipantColumns } from "@/components/participants/participant-columns";
import { DataTable } from "@/components/dt/data-table";
import { ParticipantOverviewCards } from "@/components/participants/participants-overview-cards";

export default function ParticipantsPage() {
  const queryClient = useQueryClient();
  const [checkedParticipants, setCheckedParticipants] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: participants,
    isLoading,
    isError,
  } = useAuthQuery(["participants"], fetchParticipants);

  const deleteParticipantMutation = useAuthMutation(deleteParticipant, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
      toast.success("Participant deleted successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to delete participant: ${errorMessage}`);
      console.error("Error deleting participant:", error);
    },
  });

  const handleDeleteParticipant = useCallback(() => {
    async (participantId: string) => {
      if (window.confirm("Are you sure you want to delete this participant?")) {
        try {
          await deleteParticipantMutation.mutateAsync(participantId);
        } catch (error) {
          console.error("Delete submission error:", error);
        }
      }
    };
  }, [deleteParticipantMutation]);

  const columns = useMemo(
    () => getParticipantColumns(() => handleDeleteParticipant),
    [handleDeleteParticipant]
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching participants</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-start space-y-4 md:flex-col md:items-start md:space-y-1">
        <ParticipantOverviewCards participants={participants} />
        <h2 className="text-2xl font-bold">Gestion des participants</h2>
        {checkedParticipants.length > 0 && (
          <Button onClick={() => setIsDialogOpen(true)}>
            Ajouter Action Formation
          </Button>
        )}
      </div>
      <DataTable data={participants} columns={columns} searchColumn="email" />
      {isDialogOpen && (
        <ParticipateManyDialog
          participantsIds={checkedParticipants}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </div>
  );
}
