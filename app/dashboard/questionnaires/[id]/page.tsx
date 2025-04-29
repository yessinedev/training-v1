"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CreateResponse, Survey } from "@/types";
import { fetchSurveyById } from "@/services/surveyService";
import SurveyPreviewer from "@/components/evaluations/SurveyPreviewer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createResponse } from "@/services/responseService";
import { useUser } from "@clerk/nextjs";

export default function SurveyResponsePage() {
  const params = useParams();
  const surveyId = params.id as string;
  const { user } = useUser();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const { data: survey, isLoading } = useQuery<Survey>({
    queryKey: ["survey", surveyId],
    queryFn: () => fetchSurveyById(surveyId),
  });

  const submitResponseMutation = useMutation({
    mutationFn: (responseData: CreateResponse) => createResponse(responseData),
    onSuccess: () => {
      toast.success("Response submitted successfully!");
      setAnswers({});
    },
    onError: (error: Error) => {
      console.error("Error submitting response:", error);
      toast.error(`Failed to submit response: ${error.message}`);
    },
  });

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    const requiredQuestions = survey?.questions.filter((q) => q.required) || [];
    const missingRequired = requiredQuestions.filter((q) => !answers[q.id]);

    if (missingRequired.length > 0) {
      toast.error("Please answer all required questions");
      return;
    }

    const responseData: CreateResponse = {
      surveyId: surveyId,
      participantId: isAnonymous ? undefined : user?.id,
      answers: Object.entries(answers).map(([questionId, content]) => ({
        questionId,
        content: typeof content === 'object' ? content : { value: content },
      })),
    };

    submitResponseMutation.mutate(responseData);
  };

  if (isLoading) return <div>Loading survey...</div>;
  if (!survey) return <div>Survey not found</div>;

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{survey.title}</CardTitle>
          {survey.description && (
            <p className="text-muted-foreground mt-2">{survey.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Switch
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
              id="anonymous-mode"
            />
            <label htmlFor="anonymous-mode">Submit anonymously</label>
          </div>

          <SurveyPreviewer
            survey={survey}
            onAnswerChange={handleAnswerChange}
            answers={answers}
          />

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={submitResponseMutation.isPending}
            >
              {submitResponseMutation.isPending
                ? "Submitting..."
                : "Submit Response"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
