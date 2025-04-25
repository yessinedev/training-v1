"use client";
import React, { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Domain, Theme } from "@/types";
import { toast } from "sonner";
import DomainForm from "./domain-form";
import ThemeForm from "../themes/theme-form";
import { deleteDomaine, fetchDomaines } from "@/services/domaineService";
import { fetchThemes } from "@/services/themeService";

const DomainsTable = () => {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isDomainDialogOpen, setIsDomainDialogOpen] = useState(false);
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const handleOpenDomainDialog = (domain?: Domain) => {
    setSelectedDomain(domain ?? null);
    setIsDomainDialogOpen(true);
  };

  const handleCloseDomainDialog = () => {
    setSelectedDomain(null);
    setIsDomainDialogOpen(false);
  };

  const handleOpenThemeDialog = (theme?: Theme) => {
    setSelectedTheme(theme ?? null);
    setIsThemeDialogOpen(true);
  };

  const handleCloseThemeDialog = () => {
    setSelectedTheme(null);
    setIsThemeDialogOpen(false);
  };

  const {
    data: domains,
    isLoading: domainsLoading,
    isError: domainsError,
  } = useQuery({
    queryKey: ["domaines"],
    queryFn: fetchDomaines,
  });

  const {
    data: themes,
    isLoading: themesLoading,
    isError: themesError,
  } = useQuery({
    queryKey: ["themes"],
    queryFn: fetchThemes,
  });

  const deleteDomainMutation = useMutation({
    mutationFn: deleteDomaine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domaines"] });
      toast.success("Le domaine a été supprimé avec succès");
    },
    onError: (error: Error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Un erreur est survenue";
      toast.error(errorMessage);
    },
  });

  const handleDeleteDomain = async (domainId: number) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce domaine ?")) {
      try {
        await deleteDomainMutation.mutateAsync(domainId);
      } catch (error) {
        toast.error("Erreur lors de la suppression du domaine");
      }
    }
  };

  if (domainsLoading || themesLoading) return <p>Loading...</p>;
  if (domainsError || themesError) return <p>Error fetching data</p>;

  return (
    <>
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outline" onClick={() => handleOpenThemeDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Theme
        </Button>
        <Button onClick={() => handleOpenDomainDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Domain
        </Button>
      </div>

      <DomainForm
        domain={selectedDomain || undefined}
        isOpen={isDomainDialogOpen}
        onClose={handleCloseDomainDialog}
        onOpenChange={setIsDomainDialogOpen}
      />

      <ThemeForm
        theme={selectedTheme || undefined}
        isOpen={isThemeDialogOpen}
        onClose={handleCloseThemeDialog}
        onOpenChange={setIsThemeDialogOpen}
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              <TableHead>Themes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains?.map((domain: Domain) => {
              const domainThemes = themes?.filter(
                (t: Theme) => t.domaine_id === domain.domaine_id
              );

              return (
                <TableRow key={domain.domaine_id}>
                  <TableCell className="font-medium">
                    {domain.libelle_domaine}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {domainThemes?.map((theme: Theme) => (
                        <Badge
                          key={theme.theme_id}
                          variant="secondary"
                          className="flex items-center gap-2"
                        >
                          {theme.libelle_theme}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 text-muted-foreground hover:text-foreground"
                            onClick={() => handleOpenThemeDialog(theme)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
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
                              onClick={() => handleOpenDomainDialog(domain)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit domain</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit domain</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() =>
                                handleDeleteDomain(domain.domaine_id)
                              }
                              disabled={deleteDomainMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete domain</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete domain</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default DomainsTable;
