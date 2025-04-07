"use client";
import { format } from "date-fns";
import { Trash2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { Participant } from "@/types";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { useMemo, useState } from "react";
import { ParticipateManyDialog } from "@/components/participants/ParticipateManyDialog";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import {
  deleteParticipant,
  fetchParticipants,
} from "@/services/participantService";
import { useAuthMutation } from "@/hooks/useAuthMutation";
import { getParticipantColumns } from "@/components/participants/participant-columns";
import { DataTable } from "@/components/dt/data-table";

export default function ParticipantsPage() {
  const queryClient = useQueryClient();
  const [checkedParticipants, setCheckedParticipants] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCheckboxChange = (participantId: string, checked: boolean) => {
    console.log(participantId, checked);
    setCheckedParticipants((prev) =>
      checked
        ? [...prev, participantId]
        : prev.filter((id) => id !== participantId)
    );
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

  const handleDeleteParticipant = async (participantId: string) => {
    if (window.confirm("Are you sure you want to delete this participant?")) {
      try {
        await deleteParticipantMutation.mutateAsync(participantId);
      } catch (error) {
        console.error("Delete submission error:", error);
      }
    }
  };

  const columns = useMemo(
        () => getParticipantColumns(() => handleDeleteParticipant),
        []
      );

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching participants</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-3">
        <h2 className="text-2xl font-bold">Participants</h2>
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
