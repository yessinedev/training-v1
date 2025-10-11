"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFormations } from "@/services/formationService";
import { updateSurvey } from "@/services/surveyService";
import { Formation, Survey } from "@/types";
import { toast } from "sonner";

type AttachFormationsDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  survey: Survey;
};

const AttachFormationsDialog = ({ isOpen, onOpenChange, survey }: AttachFormationsDialogProps) => {
  const [selectedFormations, setSelectedFormations] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isOpen) {
      setSelectedFormations([]);
    }
  }, [isOpen]);

  const { data: allFormations = [], isLoading: isLoadingFormations } = useQuery<Formation[]>({
    queryKey: ["formations"],
    queryFn: fetchFormations,
  });

  const availableFormations = allFormations.filter(
    (formation) => 
      !survey.formations?.some((f) => f.action_id === formation.action_id)
  );

  const attachFormationsMutation = useMutation({
    mutationFn: async () => {
      // Get the action_ids of current formations from the survey
      const currentFormations = survey.formations?.map(f => f.action_id) || [];
      
      const formationIdsToAttach = selectedFormations;
      
      const updatedFormationIds = Array.from(new Set([...currentFormations, ...formationIdsToAttach]));
      
      return updateSurvey(survey.id, {
        ...survey,
        action_ids: updatedFormationIds, 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
      queryClient.invalidateQueries({ queryKey: ["survey", survey.id] });
      toast.success("Formations attachées avec succès!");
      onOpenChange(false);
    },
    onError: (error) => {
        console.error(error)
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue";
      toast.error(`Échec de l'attachement des formations: ${errorMessage}`);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = () => {
    if (selectedFormations.length === 0) {
      toast.warning("Veuillez sélectionner au moins une formation");
      return;
    }
    
    setIsLoading(true);
    attachFormationsMutation.mutate();
  };

  const toggleFormation = (formationId: number) => {
    setSelectedFormations((prev) =>
      prev.includes(formationId)
        ? prev.filter((id) => id !== formationId)
        : [...prev, formationId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Attacher des formations au questionnaire</DialogTitle>
        </DialogHeader>
        
        {isLoadingFormations ? (
          <p>Chargement des formations...</p>
        ) : availableFormations.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            Toutes les formations sont déjà attachées à ce questionnaire.
          </p>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {availableFormations.map((formation) => (
                <div key={formation.action_id} className="flex items-start space-x-2 border p-3 rounded-md">
                  <Checkbox
                    id={`formation-${formation.action_id}`}
                    checked={selectedFormations.includes(formation.action_id)}
                    onCheckedChange={() => toggleFormation(formation.action_id)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor={`formation-${formation.action_id}`}
                      className="font-medium"
                    >
                      {formation.theme.libelle_theme}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {formation.lieu} | {new Date(formation.date_debut).toLocaleDateString()} - {new Date(formation.date_fin).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit} 
            disabled={isLoading || availableFormations.length === 0}
          >
            {isLoading ? "En cours..." : "Attacher les formations"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttachFormationsDialog;