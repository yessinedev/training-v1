'use client';

import React, { useState } from "react";
import { Pencil, Trash2, Plus, FileText, Badge } from "lucide-react";
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
import { Formateur } from "@/types";
import { toast } from "sonner";
import FormateurForm from "./formateur-form";

const FormateursTable = () => {
  const [selectedFormateur, setSelectedFormateur] = useState<Formateur | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const handleOpenDialog = (formateur?: Formateur) => {
    setSelectedFormateur(formateur ?? null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedFormateur(null);
    setIsDialogOpen(false);
  };

  const {
    data: formateurs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["formateurs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/formateurs");
      return response.data;
    },
  });

  const deleteFormateurMutation = useMutation({
    mutationFn: async (formateurId: number) => {
      await axiosInstance.delete(`/formateurs?id=${formateurId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formateurs"] });
      toast.success("Formateur deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete formateur: ${error.message}`);
      console.error("Error deleting formateur:", error);
    },
  });

  const handleDeleteFormateur = async (formateurId: number) => {
    if (window.confirm("Are you sure you want to delete this formateur?")) {
      try {
        await deleteFormateurMutation.mutateAsync(formateurId);
      } catch (error) {
        console.error("Delete submission error:", error);
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching formateurs</p>;

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Formateur
        </Button>
      </div>

      <FormateurForm
        formateur={selectedFormateur || undefined}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onOpenChange={setIsDialogOpen}
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formateurs?.map((formateur: Formateur) => (
              <TableRow key={formateur.formateur_id}>
                <TableCell>{formateur.formateur_id}</TableCell>
                <TableCell>
                  {formateur.user.prenom} {formateur.user.nom}
                </TableCell>
                <TableCell>{formateur.user.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {formateur.cv_path && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => window.open(formateur.cv_path, '_blank')}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View CV</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {formateur.badge_path && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => window.open(formateur.badge_path, '_blank')}
                            >
                              <Badge className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Badge</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
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
                            onClick={() => handleOpenDialog(formateur)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit formateur</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit formateur</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteFormateur(formateur.formateur_id)}
                            disabled={deleteFormateurMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete formateur</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete formateur</p>
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
    </>
  );
};

export default FormateursTable;