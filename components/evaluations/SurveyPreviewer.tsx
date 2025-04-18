"use client";

import React from "react";
import { Survey, Question } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

interface SurveyPreviewerProps {
  survey: Survey;
}

export default function SurveyPreviewer({ survey }: SurveyPreviewerProps) {
  return (
    <div className="space-y-6">
      {/* Optional progress indicator */}
      

      <Card>
        
        <CardContent className="space-y-8 px-4 py-6">
          {survey.questions.map((q, i) => (
            <QuestionPreview key={q.id} question={q} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

interface QuestionPreviewProps {
  question: Question;
}

function QuestionPreview({ question}: QuestionPreviewProps) {
  return (
    <Card className="border border-border">
      <CardContent className="space-y-4 px-4 py-4">
        <Label className="block text-lg font-semibold">
          {question.text}
          {question.required && (
            <span className="mr-1 text-red-600 font-light">*</span>
          )}
        </Label>

        {question.type === "text" && (
          <Textarea
            placeholder="Enter your response..."
            className="w-full resize-none"
          />
        )}

        {question.type === "multiple_choice" && question.options && (
          <RadioGroup className="space-y-3">
            {question.options.map((opt, idx) => (
              <label
                key={idx}
                htmlFor={`q-${question.id}-opt-${idx}`}
                className="flex items-center space-x-3 p-3 border rounded hover:bg-accent/10 cursor-pointer"
              >
                <RadioGroupItem
                  id={`q-${question.id}-opt-${idx}`}
                  value={opt}
                />
                <span>{opt}</span>
              </label>
            ))}
          </RadioGroup>
        )}

        {question.type === "rating" && (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant="outline"
                className="flex items-center justify-center h-10 w-10 p-0"
                aria-label={`Rate ${star} stars`}
              >
                <Star className="h-5 w-5 text-muted-foreground hover:text-accent" />
              </Button>
            ))}
          </div>
        )}

        {question.type === "boolean" && (
          <div className="flex items-center space-x-6">
            {["Yes", "No"].map((label) => (
              <label
                key={label}
                htmlFor={`${label.toLowerCase()}-${question.id}`}
                className="flex items-center space-x-2"
              >
                <Switch id={`${label.toLowerCase()}-${question.id}`} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
