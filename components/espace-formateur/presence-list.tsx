"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchParticipantsByFormationId } from "@/services/formationService";
import {
  ActionFormationParticipant,
  CreatePresenceDto,
  Presence,
  PresenceStatus,
} from "@/types";
import {
  createPresence,
  fetchPresencesBySession,
  updatePresence,
} from "@/services/presenceService";
import { useFormateur } from "@/hooks/useFormateur";

interface PresenceListProps {
  sessionId: number;
  formationId: number;
}

export function PresenceList({ sessionId, formationId }: PresenceListProps) {
  const queryClient = useQueryClient();
  const { formateur } = useFormateur();
  // Fetch participants
  const { data: actions = [] } = useQuery<ActionFormationParticipant[]>({
    queryKey: ["formation-participants", formationId],
    queryFn: () => fetchParticipantsByFormationId(formationId),
    enabled: !!formationId,
  });

  console.log(actions);

  // Fetch presences for this session
  const { data: presences = [], isLoading: isLoadingPresences } = useQuery<
    Presence[]
  >({
    queryKey: ["presences", sessionId],
    queryFn: () => fetchPresencesBySession(sessionId),
    enabled: !!sessionId,
  });

  // Mutations for marking presence
  const markPresenceMutation = useMutation({
    mutationFn: async ({
      presenceId,
      participantId,
      status,
    }: {
      presenceId?: number;
      participantId: string;
      status: PresenceStatus;
    }) => {
      if (presenceId) {
        // Update existing presence
        return updatePresence(presenceId, { status: status as PresenceStatus });
      } else {
        // Create new presence
        const data = {
          participant_id: participantId,
          formateur_id: formateur?.user_id,
          seance_id: sessionId,
          status,
        };
        return createPresence(data as CreatePresenceDto);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presences", sessionId] });
    },
  });

  // Helper to get presence for a participant
  const getPresenceForParticipant = (participantId: string) =>
    presences.find((p) => p.participant_id === participantId);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Participant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actions && actions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                Aucun participant pour cette session
              </TableCell>
            </TableRow>
          ) : (
            actions &&
            actions.map((action) => {
              const presence = getPresenceForParticipant(
                action.participant.user_id
              );
              return (
                <TableRow key={action.participant.user_id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {action.participant.user.prenom.charAt(0)}
                          {action.participant.user.nom.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {action.participant.user.prenom}{" "}
                          {action.participant.user.nom}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {action.participant.entreprise}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        presence?.status === "PRESENT"
                          ? "default"
                          : presence?.status === "ABSENT"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {presence?.status === "PRESENT"
                        ? "Présent"
                        : presence?.status === "ABSENT"
                        ? "Absent"
                        : "Non marqué"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant={
                          presence?.status === "PRESENT" ? "default" : "outline"
                        }
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          markPresenceMutation.mutate({
                            presenceId: presence?.presence_id,
                            participantId: action.participant.user_id,
                            status: PresenceStatus.PRESENT,
                          })
                        }
                        disabled={markPresenceMutation.isPending}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          presence?.status === "ABSENT"
                            ? "destructive"
                            : "outline"
                        }
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          markPresenceMutation.mutate({
                            presenceId: presence?.presence_id,
                            participantId: action.participant.user_id,
                            status: PresenceStatus.ABSENT,
                          })
                        }
                        disabled={markPresenceMutation.isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
