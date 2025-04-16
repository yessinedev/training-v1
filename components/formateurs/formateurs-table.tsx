"use client";

import React, { useCallback, useMemo, useState } from "react";
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
import { DataTable } from "../dt/data-table";
import { getFormateurColumns } from "./formateur-columns";
import FormateurProfile from "./formateur-profile";

const FormateursTable = () => {
  const [selectedFormateur, setSelectedFormateur] = useState<Formateur | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const queryClient = useQueryClient();

  const handleOpenDialog = (formateur?: Formateur) => {
    setSelectedFormateur(formateur ?? null);
    setIsDialogOpen(true);
  };

  const handleShowProfile = (formateur: Formateur) => {
    setSelectedFormateur(formateur);
    setShowProfile(true);
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
    mutationFn: async (formateurId: string) => {
      await axiosInstance.delete(`/formateurs/${formateurId}`);
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

  const handleDeleteFormateur = useCallback(async (formateurId: string) => {
    if (window.confirm("Are you sure you want to delete this formateur?")) {
      try {
        await deleteFormateurMutation.mutateAsync(formateurId);
      } catch (error) {
        console.error("Delete submission error:", error);
      }
    }
  }, [deleteFormateurMutation]);

  const columns = useMemo(
    () =>
      getFormateurColumns(
        handleDeleteFormateur,
        handleOpenDialog,
        handleShowProfile
      ),
    [handleDeleteFormateur]
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching formateurs</p>;

  return (
    <div className="">
      <Button onClick={() => handleOpenDialog()}>
        <Plus className="mr-2 h-4 w-4" />
        Ajouter Formateur
      </Button>
      <DataTable data={formateurs} columns={columns} />
      {isDialogOpen && (
        <FormateurForm
          formateur={selectedFormateur || undefined}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onOpenChange={setIsDialogOpen}
        />
      )}

      {showProfile && selectedFormateur && (
        <FormateurProfile
          formateur={selectedFormateur}
          isOpen={showProfile}
          onOpenChange={setShowProfile}
        />
      )}
    </div>
  );
};

export default FormateursTable;
