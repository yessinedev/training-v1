"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  Pencil,
  Trash2,
  Plus,
  Calendar,
  MapPin,
  Users,
  ArrowRight,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { Domain, Formation, Theme } from "@/types";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderTree, BookOpen } from "lucide-react";
import FormationForm from "./formation-form";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { deleteFormation, fetchFormations } from "@/services/formationService";
import { fetchDomaines } from "@/services/domaineService";
import { fetchThemes } from "@/services/themeService";
import { useAuthMutation } from "@/hooks/useAuthMutation";

const FormationsTable = () => {
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const handleOpenDialog = (formation?: Formation) => {
    setSelectedFormation(formation ?? null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedFormation(null);
    setIsDialogOpen(false);
  };

  const {
    data: formations,
    isLoading,
    isError,
  } = useAuthQuery(["formations"], fetchFormations);

  const { data: domaines } = useAuthQuery(["domaines"], fetchDomaines);

  const { data: themes } = useAuthQuery(["themes"], fetchThemes);

  const deleteFormationMutation = useAuthMutation(deleteFormation, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formations"] });
      toast.success("Formation deleted successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to delete user: ${errorMessage}`);
      console.error("Error deleting formation:", error);
    },
  });

  const handleDeleteFormation = async (formationId: number) => {
    if (window.confirm("Are you sure you want to delete this formation?")) {
      try {
        await deleteFormationMutation.mutateAsync(formationId);
      } catch (error) {
        console.error("Delete submission error:", error);
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching formations</p>;

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une session
        </Button>
      </div>

      <FormationForm
        formation={selectedFormation || undefined}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onOpenChange={setIsDialogOpen}
      />

      <div className="grid gap-6">
        {domaines?.map((domaine: Domain) => {
          const domaineThemes = themes?.filter(
            (t: Theme) => t.domaine_id === domaine.domaine_id
          );

          return (
            <Card key={domaine.domaine_id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderTree className="h-5 w-5" />
                  {domaine.libelle_domaine}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {domaineThemes?.map((theme: Theme) => {
                  const themeFormations = formations?.filter(
                    (f: Formation) => f.theme_id === theme.theme_id
                  );

                  return (
                    <div key={theme.theme_id} className="space-y-4">
                      <h4 className="flex items-center gap-2 font-semibold">
                        <BookOpen className="h-4 w-4" />
                        {theme.libelle_theme}
                      </h4>
                      <div className="rounded-lg border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Type</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Duration</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Participants</TableHead>
                              <TableHead>Trainer</TableHead>
                              <TableHead className="text-right">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {themeFormations?.map((formation: Formation) => (
                              <TableRow key={formation.action_id}>
                                <TableCell>
                                  <Badge variant="outline">
                                    {formation.type_action}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {format(
                                      new Date(formation.date_debut),
                                      "dd/MM/yyyy"
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {formation.duree_jours} days (
                                  {formation.duree_heures}h)
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {formation.lieu}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    {formation.nb_participants_prevu}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {
                                    formation.formateurs[0]?.formateur.user
                                      .prenom
                                  }{" "}
                                  {formation.formateurs[0]?.formateur.user.nom}
                                </TableCell>
                                <TableCell className="text-right">
                                  <TooltipProvider>
                                    <div className="flex items-center justify-end gap-2">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            asChild
                                          >
                                            <Link
                                              href={`/dashboard/sessions/${formation.action_id}`}
                                            >
                                              <ArrowRight className="h-4 w-4" />
                                              <span className="sr-only">
                                                Gérer la session
                                              </span>
                                            </Link>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p> Gérer la session</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() =>
                                              handleOpenDialog(formation)
                                            }
                                          >
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">
                                              Modifier la session
                                            </span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Modifier la session</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive"
                                            onClick={() =>
                                              handleDeleteFormation(
                                                formation.action_id
                                              )
                                            }
                                            disabled={
                                              deleteFormationMutation.isPending
                                            }
                                          >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">
                                              Supprimer la session
                                            </span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Supprimer la session </p>
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
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default FormationsTable;
