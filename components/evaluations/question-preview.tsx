"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface QuestionPreviewProps {
  question: Question;
}

export function QuestionPreview({ question }: QuestionPreviewProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Label className="text-base">
            {question.text}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          {question.type === 'text' && (
            <Input placeholder="Votre réponse..." />
          )}

          {question.type === 'choice' && question.options && (
            <RadioGroup>
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === 'rating' && (
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  className="h-10 w-10 rounded-full p-0"
                >
                  {value}
                </Button>
              ))}
            </div>
          )}

          {question.type === 'boolean' && (
            <RadioGroup>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="yes" />
                <Label htmlFor="yes">Oui</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="no" />
                <Label htmlFor="no">Non</Label>
              </div>
            </RadioGroup>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
import { Question } from "@/types";
