"use client";

import React from "react";
import { Question } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GripVerticalIcon, TrashIcon, PlusIcon, XIcon } from "lucide-react";
import { parseQuestionOptions } from "@/lib/utils";

interface Props {
  questions: Question[];
  onUpdate: (id: string, changes: Partial<Question>) => void;
  onRemove: (id: string) => void;
}

export default function SurveyBuilder({
  questions,
  onUpdate,
  onRemove,
}: Props) {
  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <QuestionEditor
          key={q.id}
          question={q}
          onChange={(changes) => onUpdate(q.id, changes)}
          onRemove={() => onRemove(q.id)}
        />
      ))}
    </div>
  );
}

interface EditorProps {
  question: Question;
  onChange: (changes: Partial<Question>) => void;
  onRemove: () => void;
}

export function QuestionEditor({ question, onChange, onRemove }: EditorProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  

  const addOption = () => {
    if (question.options) {
      onChange({
        options: [...question.options, `Option ${question.options.length + 1}`],
      });
    }
  };

  const updateOption = (index: number, value: string) => {
    if (question.options) {
      const opts = [...question.options];
      opts[index] = value;
      onChange({ options: opts });
    }
  };

  const removeOption = (index: number) => {
    if (question.options && question.options.length > 1) {
      onChange({
        options: question.options.filter((_, i) => i !== index),
      });
    }
  };

  return (
    <Card ref={setNodeRef} style={style}>
      <CardHeader className="flex flex-row items-center justify-between py-2 px-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab p-2 hover:bg-accent/10 rounded-md"
        >
          <GripVerticalIcon className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          value={question.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Question text"
          className="flex-1 mx-4"
        />
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Switch
              id={`req-${question.id}`}
              checked={question.required}
              onCheckedChange={(val) => onChange({ required: val })}
            />
            <Label htmlFor={`req-${question.id}`} className="text-sm">
              Required
            </Label>
          </div>
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <TrashIcon className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>

      {/* Body: options list */}
      {question.type === "multiple_choice" && question.options && (
        <CardContent className="space-y-2 px-3 pb-3">
          {parseQuestionOptions(question).map((opt, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <Input
                value={opt}
                onChange={(e) => updateOption(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
              />
              {question.options && question.options.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(idx)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={addOption}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Option
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
