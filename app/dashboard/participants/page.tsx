"use client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCallback, useMemo, useState } from "react";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import {
  deleteParticipant,
  fetchParticipants,
} from "@/services/participantService";
import { useAuthMutation } from "@/hooks/useAuthMutation";
import { getParticipantColumns } from "@/components/participants/participant-columns";
import { DataTable } from "@/components/dt/data-table";
import { ParticipantOverviewCards } from "@/components/participants/participants-overview-cards";
import { Participant } from "@/types";
import ParticipantProfile from "@/components/participants/participant-profile";

export default function ParticipantsPage() {
  const [showProfile, setShowProfile] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const handleOpenDialog = (participant?: Participant) => {
    setSelectedParticipant(participant ?? null);
    setIsDialogOpen(true);
  };

  const handleShowProfile = (participant: Participant) => {
    setSelectedParticipant(participant);
    setShowProfile(true);
  };

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

  const handleDeleteParticipant = useCallback(
    async (participantId: string) => {
      console.log("Deleting participant with ID:", participantId);
      if (window.confirm("Are you sure you want to delete this participant?")) {
        try {
          await deleteParticipantMutation.mutateAsync(participantId);
        } catch (error) {
          console.error("Delete submission error:", error);
        }
      }
    },
    [deleteParticipantMutation]
  );

  const columns = useMemo(
    () =>
      getParticipantColumns(
        handleDeleteParticipant,
        handleOpenDialog,
        handleShowProfile
      ),
    [handleDeleteParticipant]
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching participants</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-start space-y-4 md:flex-col md:items-start md:space-y-1">
        <ParticipantOverviewCards participants={participants} />
        <h2 className="text-2xl font-bold">Gestion des participants</h2>
      </div>
      <DataTable data={participants} columns={columns} searchColumn="email" />
      {showProfile && selectedParticipant && (
        <ParticipantProfile
          participant={selectedParticipant}
          isOpen={showProfile}
          onOpenChange={setShowProfile}
        />
      )}
    </div>
  );
}
