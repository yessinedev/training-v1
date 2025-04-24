"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import {
  fetchSurveys,
} from "@/services/surveyService";
import { Survey } from "@/types";
import CreateSurveyDialog from "@/components/evaluations/CreateSurveyDialog";
import Link from "next/link";

const SurveysPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: surveys = [],
    isLoading,
    isError,
    error,
  } = useAuthQuery<Survey[]>(["surveys"], fetchSurveys);

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
            <Card key={survey.id} className="shadow-md border-l-[7px] border-primary hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{survey.title}</CardTitle>
                <CardDescription>
                  {survey.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Status: {survey.status}
                </p>
                {/* Add more details like question count if needed */}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Link
                  href={`/dashboard/questionnaires/editeur/${survey.id}`}
                  className="flex justify-end"
                    passHref
                >
                  <Button variant="outline" size="lg">
                    Modifier
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CreateSurveyDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default SurveysPage;
