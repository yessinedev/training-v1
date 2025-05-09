"use client";
import React from "react";
import { Survey, Question } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Star } from "lucide-react";
import { parseQuestionOptions } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface SurveyPreviewerProps {
  survey: Survey;
  onAnswerChange?: (questionId: string, value: any) => void;
  answers?: Record<string, any>;
}

export default function SurveyPreviewer({ 
  survey,
  onAnswerChange,
  answers = {}
}: SurveyPreviewerProps) {
  return (
    <div className="space-y-6">
      {survey.questions.map((q) => (
        <QuestionPreview 
          key={q.id} 
          question={q}
          value={answers[q.id]}
          onChange={onAnswerChange ? (value) => onAnswerChange(q.id, value) : undefined}
        />
      ))}
    </div>
  );
}

interface QuestionPreviewProps {
  question: Question;
  value?: any;
  onChange?: (value: any) => void;
}

function QuestionPreview({ question, value, onChange }: QuestionPreviewProps) {
 
  const handleChange = (newValue: any) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  // Helper for multiple_choice (checkbox group)
  const handleCheckboxChange = (option: string, checked: boolean) => {
    let newValue: string[] = Array.isArray(value) ? [...value] : [];
    if (checked) {
      if (!newValue.includes(option)) newValue.push(option);
    } else {
      newValue = newValue.filter((v) => v !== option);
    }
    handleChange(newValue);
  };

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
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            disabled={!onChange}
          />
        )}

        {question.type === "single_choice" && question.options && (
          <RadioGroup 
            value={value} 
            onValueChange={handleChange}
            disabled={!onChange}
          >
            {parseQuestionOptions(question).map((opt, idx) => (
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

        {question.type === "multiple_choice" && question.options && (
          <div className="space-y-2">
            {parseQuestionOptions(question).map((opt, idx) => (
              <label
                key={idx}
                htmlFor={`q-${question.id}-opt-${idx}`}
                className="flex items-center space-x-3 p-3 border rounded hover:bg-accent/10 cursor-pointer"
              >
                <Checkbox
                  id={`q-${question.id}-opt-${idx}`}
                  checked={Array.isArray(value) ? value.includes(opt) : false}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(opt, !!checked)
                  }
                  disabled={!onChange}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === "rating" && (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant={value === star ? "default" : "outline"}
                className="flex items-center justify-center h-10 w-10 p-0"
                onClick={() => handleChange(star)}
                disabled={!onChange}
              >
                <Star className={`h-5 w-5 ${value === star ? "fill-current" : ""}`} />
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
                <Switch
                  id={`${label.toLowerCase()}-${question.id}`}
                  checked={value === (label === "Yes")}
                  onCheckedChange={() => handleChange(label === "Yes")}
                  disabled={!onChange}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}