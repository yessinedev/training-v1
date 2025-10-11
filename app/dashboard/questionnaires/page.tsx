"use client";

import React, { useState } from "react";
import { Plus, BarChart2, Edit, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchSurveys } from "@/services/surveyService";
import { Survey } from "@/types";
import CreateSurveyDialog from "@/components/evaluations/CreateSurveyDialog";
import AttachFormationsDialog from "@/components/evaluations/AttachFormationsDialog";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const SurveysPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAttachDialogOpen, setIsAttachDialogOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  const {
    data: surveys = [],
    isLoading,
    isError,
    error,
  } = useQuery<Survey[]>({
    queryKey: ["surveys"],
    queryFn: fetchSurveys,
  });

  const handleOpenAttachDialog = (survey: Survey) => {
    setSelectedSurvey(survey);
    setIsAttachDialogOpen(true);
  };

  if (isLoading) return <p>Loading surveys...</p>;
  if (isError) return <p>Error fetching surveys: {error?.message}</p>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Questionnaires</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Creer un questionnaire
        </Button>
      </div>

      {surveys.length === 0 ? (
        <p className="text-center text-gray-500">
          Aucun questionnaire trouvé. Créez-en un !
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <Card
              key={survey.id}
              className="shadow-md border-l-[7px] border-primary hover:shadow-lg transition-shadow "
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{survey.title}</CardTitle>
                  <Badge variant={survey.status === "publié" ? "default" : "outline"}>
                    {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                  </Badge>
                </div>
                <CardDescription>
                  {survey.description || ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Créer le: {formatDate(new Date(survey.createdAt!))}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Formations attachées:</span>{" "}
                    {survey.formations?.length || 0}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-1">
                <Link
                  href={`/dashboard/questionnaires/responses/${survey.id}`}
                  className="flex items-center"
                  passHref
                >
                  <Button variant="outline" size="sm">
                    <BarChart2 className="h-4 w-4" /> Réponses
                  </Button>
                </Link>
                <Link
                  href={`/dashboard/questionnaires/editeur/${survey.id}`}
                  className="flex items-center"
                  passHref
                >
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" /> Modifier
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleOpenAttachDialog(survey)}
                >
                  <Link2 className="h-4 w-4" /> Attacher
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CreateSurveyDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      
      {selectedSurvey && (
        <AttachFormationsDialog
          isOpen={isAttachDialogOpen}
          onOpenChange={setIsAttachDialogOpen}
          survey={selectedSurvey}
        />
      )}
    </div>
  );
};

export default SurveysPage;