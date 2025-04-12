"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GripVerticalIcon, TrashIcon, PlusIcon, XIcon } from 'lucide-react';
import { Question } from '@/types';

interface QuestionBuilderProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onRemove: () => void;
}

export function QuestionBuilder({ question, onUpdate, onRemove }: QuestionBuilderProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const addOption = () => {
    if (question.type === 'choice' && question.options) {
      onUpdate({
        options: [...question.options, `Option ${question.options.length + 1}`]
      });
    }
  };

  const updateOption = (index: number, value: string) => {
    if (question.type === 'choice' && question.options) {
      const newOptions = [...question.options];
      newOptions[index] = value;
      onUpdate({ options: newOptions });
    }
  };

  const removeOption = (index: number) => {
    if (question.type === 'choice' && question.options && question.options.length > 1) {
      onUpdate({
        options: question.options.filter((_, i) => i !== index)
      });
    }
  };

  return (
    <Card ref={setNodeRef} style={style}>
      <CardHeader className="flex flex-row items-center gap-4 py-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab p-2 hover:bg-accent rounded-md"
        >
          <GripVerticalIcon className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          value={question.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="Question..."
          className="flex-1"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id={`required-${question.id}`}
              checked={question.required}
              onCheckedChange={(checked) => onUpdate({ required: checked })}
            />
            <Label htmlFor={`required-${question.id}`}>Obligatoire</Label>
          </div>
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {question.type === 'choice' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                {question.options!.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={addOption}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Ajouter une option
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}