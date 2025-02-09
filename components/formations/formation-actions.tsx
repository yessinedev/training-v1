"use client";
import { useState } from "react";
import { GraduationCap, UserPlus, Award, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import AssignTrainerDialog from "./assign-trainer-dialog";
import GenerateAttestationsDialog from "./generate-attestation-dialog";
import ParticipantForm from "../participants/participant-form";
import ExcelImportDialog from "../participants/ExcelImportDialog";

type FormationActionsProps = {
  formationId: number;
};

export default function FormationActions({
  formationId,
}: FormationActionsProps) {
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAddTrainerOpen, setIsAddTrainerOpen] = useState(false);
  const [isGenerateAttestationOpen, setIsGenerateAttestationOpen] =
    useState(false);

  const { data: formation } = useQuery({
    queryKey: ["action-formation", formationId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/formations/${formationId}`);
      return response.data;
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            className="w-full"
            onClick={() => setIsAddParticipantOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Participant
          </Button>
          <Button variant="outline" className="w-full" onClick={() => setIsUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Importer Fichier Excel
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => setIsAddTrainerOpen(true)}
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            Assign Trainer
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => setIsGenerateAttestationOpen(true)}
          >
            <Award className="mr-2 h-4 w-4" />
            Generate Attestations
          </Button>
        </CardContent>
      </Card>
      {isAddParticipantOpen && (
        <ParticipantForm
          formationId={formationId}
          isOpen={isAddParticipantOpen}
          onOpenChange={setIsAddParticipantOpen}
        />
      )}

      {isAddTrainerOpen && (
        <AssignTrainerDialog
          formationId={formationId}
          isOpen={isAddTrainerOpen}
          onOpenChange={setIsAddTrainerOpen}
        />
      )}

      {isGenerateAttestationOpen && formation && (
        <GenerateAttestationsDialog
          formationId={formationId}
          isOpen={isGenerateAttestationOpen}
          onOpenChange={setIsGenerateAttestationOpen}
          participants={formation.participants}
        />
      )}
      {isUploadOpen && (
        <ExcelImportDialog
          formationId={formationId}
          isOpen={isUploadOpen}
          onOpenChange={setIsUploadOpen}
        />
      )}
    </>
  );
}
