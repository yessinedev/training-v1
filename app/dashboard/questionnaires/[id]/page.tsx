"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { nanoid } from "nanoid";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Survey, Question, QuestionType } from "@/types";
import SurveyBuilder from "@/components/evaluations/SurveyBuilder";
import SurveyPreviewer from "@/components/evaluations/SurveyPreviewer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SaveIcon, EyeIcon } from "lucide-react";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { useAuthMutation } from "@/hooks/useAuthMutation";
import { fetchSurveyById, updateSurvey } from "@/services/surveyService";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { deleteQuestion } from "@/services/questionService";

export default function SurveyEditorPage() {
  const params = useParams();
  const surveyId = params.id as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [tab, setTab] = useState<"editeur" | "aperçu">("editeur");
  const [isSaving, setIsSaving] = useState(false);

  const {
    data: fetchedSurvey,
    isLoading: isLoadingSurvey,
    isError: isFetchError,
    error: fetchError,
  } = useAuthQuery<Survey>(
    ["survey", surveyId],
    (token) => fetchSurveyById(token, surveyId),
    undefined,
    {
      enabled: !!surveyId,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (fetchedSurvey) {
      setSurvey(fetchedSurvey);
    }
  }, [fetchedSurvey]);

  const saveSurveyMutation = useAuthMutation<Survey, Partial<Survey>>(
    (token, surveyData) => updateSurvey(token, surveyId, surveyData),
    {
      onMutate: () => {
        setIsSaving(true);
      },
      onSuccess: (updatedData) => {
        toast.success("Survey saved successfully!");
        setSurvey(updatedData);
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        toast.error(`Failed to save survey: ${errorMessage}`);
      },
      onSettled: () => {
        setIsSaving(false);
      },
    }
  );

  const deleteQuestionMutation = useAuthMutation(deleteQuestion, {
    onSuccess: (_, questionId) => {
      toast.success("Question deleted successfully!");
      setSurvey((s) => {
        if (!s) return null;
        return {
          ...s,
          questions: s.questions.filter((q) => q.id !== questionId),
        };
      });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Failed to delete question: ${errorMessage}`);
    },
  });

  const handleSave = () => {
    if (survey) {
      const surveyPayload = JSON.parse(JSON.stringify(survey));

      surveyPayload.questions = surveyPayload.questions.map((q: Question) => {
        if (q.options && Array.isArray(q.options)) {
          return {
            ...q,
            options: JSON.stringify(q.options),
          };
        }
        if (typeof q.options === "string") {
          return q;
        }
        return {
          ...q,
          options: undefined,
        };
      });
      saveSurveyMutation.mutate(surveyPayload);
    }
  };

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const addQuestion = useCallback(
    (type: QuestionType) => {
      if (!survey) return;
      setSurvey((s) => {
        if (!s) return null;
        return {
          ...s,
          questions: [
            ...s.questions,
            {
              id: nanoid(),
              surveyId: s.id,
              text: "",
              type,
              required: false,
              options: type === "multiple_choice" ? ["Option 1"] : undefined,
            },
          ],
        };
      });
    },
    [survey]
  );

  const updateQuestion = useCallback(
    (id: string, changes: Partial<Question>) => {
      setSurvey((s) => {
        if (!s) return null;
        return {
          ...s,
          questions: s.questions.map((q) =>
            q.id === id ? { ...q, ...changes } : q
          ),
        };
      });
    },
    []
  );

  const removeQuestion = useCallback(
    (id: string) => {
      setSurvey((s) => {
        if (!s) return null;
        return {
          ...s,
          questions: s.questions.filter((q) => q.id !== id),
        };
      });
      deleteQuestionMutation.mutate(id);
    },
    [deleteQuestionMutation]
  );

  const handleDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { active, over } = e;
      if (survey && over && active.id !== over.id) {
        setSurvey((s) => {
          if (!s) return null;
          const oldIdx = s.questions.findIndex((q) => q.id === active.id);
          const newIdx = s.questions.findIndex((q) => q.id === over.id);
          return {
            ...s,
            questions: arrayMove(s.questions, oldIdx, newIdx),
          };
        });
      }
    },
    [survey]
  );

  if (isLoadingSurvey) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[calc(100vh-300px)] w-full" />
          </div>
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    );
  }

  if (isFetchError || !survey) {
    return (
      <div className="container mx-auto py-8 text-center text-red-600">
        <p>
          Error loading survey: {fetchError?.message || "Survey not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col justify-center gap-2 w-full">
          <Input
            value={survey.title}
            onChange={(e) =>
              setSurvey((s) => (s ? { ...s, title: e.target.value } : null))
            }
            className="text-4xl font-bold bg-transparent shadow-md border-b-[3px] border-primary hover:shadow-lg px-2 max-w-md focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Survey Title"
          />
          <Textarea
            value={survey.description}
            onChange={(e) =>
              setSurvey((s) =>
                s ? { ...s, description: e.target.value } : null
              )
            }
            className="max-w-2xl bg-transparent shadow-md border-b-[3px] border-primary hover:shadow-lg px-2 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Survey Description"
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving}>
          <SaveIcon className="h-4 w-4 mr-2" />{" "}
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as "editeur" | "aperçu")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editeur">Editeur</TabsTrigger>
              <TabsTrigger value="aperçu">
                <EyeIcon className="h-4 w-4 mr-2" /> Aperçu
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editeur">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <SortableContext
                      items={survey.questions.map((q) => q.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <ScrollArea className="h-[calc(100vh-350px)] p-1">
                        <div className="space-y-4">
                          <SurveyBuilder
                            questions={survey.questions}
                            onUpdate={updateQuestion}
                            onRemove={removeQuestion}
                          />
                        </div>
                      </ScrollArea>
                    </SortableContext>
                  </DndContext>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="aperçu">
              <Card>
                <CardHeader className="flex flex-col gap-3">
                  <div className="bg-muted/30 p-4 rounded-t-lg border-b">
                    <CardTitle className="text-2xl">{survey.title}</CardTitle>
                    {survey.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {survey.description}
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-350px)] p-4">
                    <SurveyPreviewer survey={survey} />
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <aside>
          <Card>
            <CardHeader>
              <CardTitle>Add a Question</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {(
                [
                  "text",
                  "multiple_choice",
                  "rating",
                  "boolean",
                ] as QuestionType[]
              ).map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2 text-center"
                  onClick={() => addQuestion(type)}
                >
                  <span className="text-2xl">
                    {type === "text"
                      ? "T"
                      : type === "multiple_choice"
                      ? "🔘"
                      : type === "rating"
                      ? "⭐"
                      : "✓"}
                  </span>
                  <span className="capitalize text-xs">
                    {type.replace("_", " ")}
                  </span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
