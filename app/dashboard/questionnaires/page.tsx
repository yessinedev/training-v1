"use client";

import React, { useState, useCallback } from "react";
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
import { Progress } from "@/components/ui/progress";

export default function SurveyEditorPage() {
  const [survey, setSurvey] = useState<Survey>({
    id: nanoid(),
    title: "New Survey",
    status: "draft",
    questions: [],
  });
  const [tab, setTab] = useState<"builder" | "preview">("builder");

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const addQuestion = useCallback((type: QuestionType) => {
    setSurvey((s) => ({
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
    }));
  }, []);

  const updateQuestion = useCallback(
    (id: string, changes: Partial<Question>) => {
      setSurvey((s) => ({
        ...s,
        questions: s.questions.map((q) =>
          q.id === id ? { ...q, ...changes } : q
        ),
      }));
    },
    []
  );

  const removeQuestion = useCallback((id: string) => {
    setSurvey((s) => ({
      ...s,
      questions: s.questions.filter((q) => q.id !== id),
    }));
  }, []);

  const handleDragEnd = useCallback((e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setSurvey((s) => {
        const oldIdx = s.questions.findIndex((q) => q.id === active.id);
        const newIdx = s.questions.findIndex((q) => q.id === over.id);
        return {
          ...s,
          questions: arrayMove(s.questions, oldIdx, newIdx),
        };
      });
    }
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <Input
          value={survey.title}
          onChange={(e) => setSurvey((s) => ({ ...s, title: e.target.value }))}
          className="text-4xl font-bold bg-transparent border-none px-0 max-w-2xl"
        />
        <Button
          onClick={() => {
            /* TODO: save to backend */
          }}
        >
          <SaveIcon className="h-4 w-4 mr-2" /> Save
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* BUILDER PANEL (2 cols) */}
        <div className="lg:col-span-2">
          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as "builder" | "preview")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="builder">Builder</TabsTrigger>
              <TabsTrigger value="preview">
                <EyeIcon className="h-4 w-4 mr-2" /> Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="builder">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <SortableContext
                      items={survey.questions}
                      strategy={verticalListSortingStrategy}
                    >
                      <ScrollArea className="h-[calc(100vh-300px)] p-2">
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

            <TabsContent value="preview">
              <Card>
                <CardHeader className="flex flex-col gap-3">
                  <div className="bg-primary/10 px-4 py-3 rounded-t-lg">
                    <CardTitle className="text-2xl">{survey.title}</CardTitle>
                    {survey.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {survey.description}
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <SurveyPreviewer survey={survey} />
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* TOOLBOX PANEL (1 col) */}
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
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => addQuestion(type)}
                >
                  {/* you can swap these icons/text for your localized labels */}
                  <span className="text-2xl">
                    {type === "text"
                      ? "Aa"
                      : type === "multiple_choice"
                      ? "☑️"
                      : type === "rating"
                      ? "⭐"
                      : "✓"}
                  </span>
                  <span className="capitalize">{type.replace("_", " ")}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
