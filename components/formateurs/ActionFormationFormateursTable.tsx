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
import axiosInstance from "@/lib/axios";
import { ActionFormationFormateur } from "@/types";
import { Trash2 } from "lucide-react";

type Props = {
  actionId: number;
};

const ActionFormationFormateursTable = ({ actionId }: Props) => {
    const queryClient = useQueryClient();

  const { data: trainers = [] } = useQuery({
    queryKey: ["formation-trainers", actionId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/formations/${actionId}/formateurs`
      );
      return response.data;
    },
  });

  const removeTrainerMutation = useMutation({
    mutationFn: async ({ formateurId }: { formateurId: string }) => {
      await axiosInstance.delete(
        `/formations/${actionId}/formateurs?formateurId=${formateurId}`
      );
    },
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
                                removeTrainerMutation.mutate({
                                  formateurId: f.formateur.user_id,
                                })
                              }
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
    </>
  );
};

export default ActionFormationFormateursTable;
