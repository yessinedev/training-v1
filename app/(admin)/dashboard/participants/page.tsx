"use client";
import { format } from "date-fns";
import { Trash2,  Award } from "lucide-react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Participant } from "@/types";
import { toast } from "sonner";

export default function ParticipantsPage() {
  const queryClient = useQueryClient();

  const {
    data: participants,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["participants"],
    queryFn: async () => {
      const response = await axiosInstance.get("/participants");
      return response.data;
    },
  });

  const deleteParticipantMutation = useMutation({
    mutationFn: async (participantId: number) => {
      await axiosInstance.delete(`/participants?id=${participantId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
      toast.success("Participant deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete participant: ${error.message}`);
      console.error("Error deleting participant:", error);
    },
  });

  const handleDeleteParticipant = async (participantId: number) => {
    if (window.confirm("Are you sure you want to delete this participant?")) {
      try {
        await deleteParticipantMutation.mutateAsync(participantId);
      } catch (error) {
        console.error("Delete submission error:", error);
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching participants</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Participants</h2>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Formations</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants?.map((participant: Participant) => (
              <TableRow key={participant.participant_id}>
                <TableCell>{participant.participant_id}</TableCell>
                <TableCell>{participant.nom}</TableCell>
                <TableCell>{participant.prenom}</TableCell>
                <TableCell>{participant.email}</TableCell>
                <TableCell>{participant.entreprise}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {participant.actions?.map((pa) => (
                      <TooltipProvider
                        key={`${pa.action_id}-${pa.participant_id}`}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1">
                              <span className="text-sm">
                                {pa.action.type_action}
                              </span>
                              {participant.attestations?.some(
                                (att) => att.action_id === pa.action_id
                              ) && <Award className="h-4 w-4 text-green-500" />}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {pa.action.type_action} - {pa.action.lieu}
                              <br />
                              {format(
                                new Date(pa.action.date_debut),
                                "dd/MM/yyyy"
                              )}
                              <br />
                              Status: {pa.statut}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <div className="flex items-center justify-end gap-2">
                      {/* <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            // onClick={() => handleOpenDialog(participant)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit participant</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit participant</p>
                        </TooltipContent>
                      </Tooltip> */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() =>
                              handleDeleteParticipant(
                                participant.participant_id
                              )
                            }
                            disabled={deleteParticipantMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete participant</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete participant</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
