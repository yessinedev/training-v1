'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActionFormationFormateur, ActionFormationParticipant, Formation } from "@/types";
import axiosInstance from "@/lib/axios";

type FormationTabsProps = {
  formation: Formation;
};

export default function FormationTabs({ formation }: FormationTabsProps) {
  const queryClient = useQueryClient();

  // Fetch participants and trainers separately
  const { data: participants = [] } = useQuery({
    queryKey: ["formation-participants", formation.action_id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/formations/${formation.action_id}/participants`);
      return response.data;
    },
  });

  const { data: trainers = [] } = useQuery({
    queryKey: ["formation-trainers", formation.action_id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/formations/${formation.action_id}/formateurs`);
      return response.data;
    },
  });

  const removeParticipantMutation = useMutation({
    mutationFn: async ({ participantId }: { participantId: number }) => {
      await axiosInstance.delete(`/formations/${formation.action_id}/participants?participantId=${participantId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formation-participants", formation.action_id] });
      toast.success("Participant removed successfully");
    },
  });

  const removeTrainerMutation = useMutation({
    mutationFn: async ({ formateurId }: { formateurId: number }) => {
      await axiosInstance.delete(`/formations/${formation.action_id}/formateurs?formateurId=${formateurId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formation-trainers", formation.action_id] });
      toast.success("Trainer removed successfully");
    },
  });

  return (
    <Tabs defaultValue="participants" className="space-y-4">
      <TabsList>
        <TabsTrigger value="participants">Participants</TabsTrigger>
        <TabsTrigger value="trainers">Trainers</TabsTrigger>
      </TabsList>

      <TabsContent value="participants">
        <Card>
          <CardHeader>
            <CardTitle>Participants</CardTitle>
            <CardDescription>
              Manage participants and their attestations
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
                    <TableRow key={p.participant.participant_id}>
                      <TableCell>
                        {p.participant.prenom} {p.participant.nom}
                      </TableCell>
                      <TableCell>{p.participant.entreprise}</TableCell>
                      <TableCell>{p.participant.poste}</TableCell>
                      <TableCell>
                        <Badge
                          variant={p.statut === "Confirmé" ? "default" : "secondary"}
                        >
                          {p.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {p.attestation ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Issued
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
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
                                onClick={() => removeParticipantMutation.mutate({
                                  participantId: p.participant.participant_id,
                                })}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove participant</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove participant</p>
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
      </TabsContent>

      <TabsContent value="trainers">
        <Card>
          <CardHeader>
            <CardTitle>Trainers</CardTitle>
            <CardDescription>
              Manage trainers assigned to this session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainers.map((f: ActionFormationFormateur) => (
                    <TableRow key={f.formateur.formateur_id}>
                      <TableCell>
                        {f.formateur.user.prenom} {f.formateur.user.nom}
                      </TableCell>
                      <TableCell>{f.formateur.user.email}</TableCell>
                      <TableCell>{f.formateur.user.telephone}</TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => removeTrainerMutation.mutate({
                                  formateurId: f.formateur.formateur_id,
                                })}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove trainer</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove trainer</p>
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
      </TabsContent>
    </Tabs>
  );
}