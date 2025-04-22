"use client";
import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { CreateParticipant, ExcelParticipant, Participant, Role } from "@/types";
import * as XLSX from "xlsx";
import axiosInstance from "@/lib/axios";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { fetchRoles } from "@/services/roleService";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  formationId: number;
  onOpenChange: (open: boolean) => void;
};

const ExcelImportDialog = ({ isOpen, formationId, onOpenChange }: Props) => {
  const queryClient = new QueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data } = useAuthQuery<Role[]>(["roles"], fetchRoles);

  const uploadMutation = useMutation({
    mutationFn: async (data: CreateParticipant[]) => {
      const response = await axiosInstance.post(`/participant/create`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
    onError: (error) => {
      console.error("Upload error:", error);
      alert("Error uploading participants. Please try again.");
    },
  });

  const participateMutation = useMutation({
    mutationFn: async (data: Participant[]) => {
      const response = await axiosInstance.post(
        `/formations/${formationId}/participants`,
        data
      );
      console.log("response", response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["formation-participants", formationId],
      });
    },
    onError: (error) => {
      console.error("Upload error:", error);
      alert("Error uploading participants. Please try again.");
    },
  });

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const role = data?.find((role) => role.role_name === "PARTICIPANT");
      if (!role) {
        toast.error("Le role PARTICIPANT n'existe pas.")
        return;
      }
      const file = event.target.files?.[0];
      if (!file) return;

      setIsLoading(true);
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(
            worksheet
          ) as ExcelParticipant[];

          const processedData = jsonData.map((row) => ({
            nom: String(row["Nom"] || "").trim(),
            prenom: String(row["Prenom"] || "").trim(),
            entreprise: String(row["Entreprise"] || "").trim(),
            telephone: String(row["Telephone"] || "").trim(),
            email: String(row["Email"] || "").trim(),
            poste: String(row["Poste"] || "").trim(),
            role_id: role?.role_id,
          }));

          if (processedData.length === 0) {
            throw new Error("No valid data found in the file");
          }

          const insertedPaticipants = await uploadMutation.mutateAsync(
            processedData
          );
          if (insertedPaticipants) {
            console.log(insertedPaticipants);
            const actionParticipants = insertedPaticipants.successful.map(
              (part: Participant) => ({
                participant_id: part.user_id,
                statut: "Confirmé",
              })
            );
            await participateMutation.mutateAsync(actionParticipants);
          }
        };
        reader.readAsBinaryString(file);
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Error processing file. Please try again.");
      } finally {
        setIsLoading(false);
        onOpenChange(false);
      }
    },
    [uploadMutation, participateMutation, onOpenChange]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Participants</DialogTitle>
        </DialogHeader>
        <form>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file">Excel File</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls,.csv"
                className="cursor-pointer"
                onChange={handleFileUpload}
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Upload an Excel or CSV file containing participant information
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild className="w-full">
                <a href="#" download>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Download Template
                </a>
              </Button>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelImportDialog;
