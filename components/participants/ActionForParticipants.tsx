"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { ActionFormationParticipant } from "@/types";
import { Trash2 } from "lucide-react";

type Props = {
  actionId: number;
};

const ActionForParticipants = ({ actionId }: Props) => {
  const queryClient = useQueryClient();

  const { data: participants = [] } = useQuery({
    queryKey: ["formation-participants", actionId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/formations/${actionId}/participants`
      );
      return response.data;
    },
  });

  const removeParticipantMutation = useMutation({
    mutationFn: async ({ participantId }: { participantId: string }) => {
      await axiosInstance.delete(
        `/formations/${actionId}/participants?participantId=${participantId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["formation-participants", actionId],
      });
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Participants</CardTitle>
        <CardDescription>
          Gérer les participants de cette action de formation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attestation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((p: ActionFormationParticipant) => (
                <TableRow key={p.participant.user_id}>
                  <TableCell>
                    {p.participant.user.prenom} {p.participant.user.nom}
                  </TableCell>
                  <TableCell>{p.participant.entreprise}</TableCell>
                  <TableCell>{p.participant.poste}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.statut === "Confirmé" ? "default" : "secondary"
                      }
                    >
                      {p.statut}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {p.participant?.attestations?.[0] ? (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        Emis
                      </Badge>
                    ) : (
                      <Badge variant="outline">En attente</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() =>
                              removeParticipantMutation.mutate({
                                participantId: p.participant.user_id,
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Supprimer participant</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Supprimer participant</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionForParticipants;
