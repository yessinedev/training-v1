"use client";
import { useState } from "react";
import { GraduationCap, UserPlus, Award, Upload, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import AssignTrainerDialog from "./assign-trainer-dialog";
import GenerateAttestationsDialog from "./generate-attestation-dialog";
import ExcelImportDialog from "../participants/ExcelImportDialog";
import { ParticipantModal } from "../participants/ParticipantModal";
import AssignExistingParticipantsDialog from "./AssignExistingParticipantsDialog";
import { Formation } from "@/types";
import { fetchFormationById } from "@/services/formationService";

type FormationActionsProps = {
  formationId: number;
};

export default function FormationActions({
  formationId,
}: FormationActionsProps) {
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [isAssignExistingOpen, setIsAssignExistingOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAddTrainerOpen, setIsAddTrainerOpen] = useState(false);
  const [isGenerateAttestationOpen, setIsGenerateAttestationOpen] =
    useState(false);

  const { data: formation, isLoading: isLoadingFormation } =
    useQuery<Formation>({
      queryKey: ["action-formation", formationId],
      queryFn: () => fetchFormationById(formationId),
      enabled: !!formationId,
    });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              className="flex-grow"
              onClick={() => setIsAddParticipantOpen(true)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Créer Participant
            </Button>
            <Button
              className="flex-grow"
              variant="outline"
              onClick={() => setIsAssignExistingOpen(true)}
            >
              <Users className="mr-2 h-4 w-4" />
              Ajouter Existant(s)
            </Button>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsUploadOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Importer Fichier Excel
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => setIsAddTrainerOpen(true)}
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            Assigner Formateur
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => setIsGenerateAttestationOpen(true)}
            disabled={isLoadingFormation || !formation?.participants}
          >
            <Award className="mr-2 h-4 w-4" />
            Générer Attestations
          </Button>
        </CardContent>
      </Card>
      {isAddParticipantOpen && (
        <ParticipantModal
          formationId={formationId}
          isOpen={isAddParticipantOpen}
          onOpenChange={setIsAddParticipantOpen}
        />
      )}

      {isAssignExistingOpen && formation && (
        <AssignExistingParticipantsDialog
          formationId={formationId}
          isOpen={isAssignExistingOpen}
          onOpenChange={setIsAssignExistingOpen}
          assignedParticipants={formation.participants || []}
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
          participants={formation.participants || []}
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
