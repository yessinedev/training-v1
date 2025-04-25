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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActionFormationFormateur } from "@/types";
import { Trash2 } from "lucide-react";
import {
  fetchFormateursByFormationId,
  removeFormateurFromFormation,
} from "@/services/formationService";

type Props = {
  actionId: number;
};

const ActionFormationFormateursTable = ({ actionId }: Props) => {
  const queryClient = useQueryClient();

  const { data: trainers = [] } = useQuery({
    queryKey: ["formation-trainers", actionId],
    queryFn: () => fetchFormateursByFormationId(actionId),
  });

  const removeTrainerMutation = useMutation({
    mutationFn: (formateurId: string) =>
      removeFormateurFromFormation(actionId, formateurId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["formation-trainers", actionId],
      });
    },
  });
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Trainers</CardTitle>
          <CardDescription>
            Gérer les formateurs de cette action de formation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prénom et Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telephone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainers.map((f: ActionFormationFormateur) => (
                  <TableRow key={f.formateur.user_id}>
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
                              onClick={() =>
                                removeTrainerMutation.mutate(
                                  f.formateur.user_id
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">
                                Supprimer formateur
                              </span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Supprimer formateur</p>
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
    </>
  );
};

export default ActionFormationFormateursTable;
