"use client";

import { useState } from 'react';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuestionBuilder } from '@/components/evaluations/question-builder';
import { QuestionPreview } from '@/components/evaluations/question-preview';
import { PlusIcon, GripVerticalIcon, EyeIcon, SaveIcon } from 'lucide-react';
import { Question, QuestionType } from '@/types';



export default function SurveyPage() {
  const [title, setTitle] = useState('Nouveau Questionnaire');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState('edit');

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      text: '',
      required: false,
      options: type === 'choice' ? ['Option 1'] : undefined,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex(q => q.id === active.id);
        const newIndex = items.findIndex(q => q.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-4xl font-bold bg-transparent border-none px-0 max-w-2xl"
        />
        <Button>
          <SaveIcon className="h-4 w-4 mr-2" />
          Enregistrer
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Éditer</TabsTrigger>
              <TabsTrigger value="preview">
                <EyeIcon className="h-4 w-4 mr-2" />
                Aperçu
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-4">
              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <SortableContext items={questions} strategy={verticalListSortingStrategy}>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-4 p-1">
                      {questions.map((question) => (
                        <QuestionBuilder
                          key={question.id}
                          question={question}
                          onUpdate={(updates) => updateQuestion(question.id, updates)}
                          onRemove={() => removeQuestion(question.id)}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </SortableContext>
              </DndContext>
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-6">
                      {questions.map((question) => (
                        <QuestionPreview key={question.id} question={question} />
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ajouter une question</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => addQuestion('text')}
              >
                <span className="text-2xl">Aa</span>
                <span>Texte</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => addQuestion('choice')}
              >
                <span className="text-2xl">☑️</span>
                <span>Choix</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => addQuestion('rating')}
              >
                <span className="text-2xl">⭐</span>
                <span>Note</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => addQuestion('boolean')}
              >
                <span className="text-2xl">✓</span>
                <span>Oui/Non</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}