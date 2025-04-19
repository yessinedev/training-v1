import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Question } from "@/types"; // Assuming Question type is defined in @/types

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDatesBetween(startDate: Date, endDate: Date): Date[] {
  // Ensure inputs are Date objects
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);

  // Validate dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.error("Invalid date provided to getDatesBetween");
    return [];
  }

  const dates: Date[] = [];
  // Use UTC dates to avoid timezone issues with date comparisons
  const currentDate = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  const lastDate = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));

  while (currentDate <= lastDate) {
    dates.push(new Date(currentDate)); // Store as local Date object if needed, or keep UTC
    // Increment UTC date
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return dates;
}

/**
 * Safely parses the options field of a question, which might be a JSON string or an array.
 * Returns an array of strings, or an empty array if parsing fails or options are not applicable.
 * @param question - The question object.
 * @returns An array of strings representing the options.
 */
export function parseQuestionOptions(question: Question | undefined | null): string[] {
  if (!question || question.type !== "multiple_choice") {
    return []; // Return empty if no question, or not multiple choice
  }

  const options = question.options;

  if (typeof options === 'string') {
    try {
      const parsed = JSON.parse(options);
      if (Array.isArray(parsed)) {
        // Ensure all elements are strings, filter out non-strings if necessary
        return parsed.filter(item => typeof item === 'string');
      }
    } catch (e) {
      console.error("Failed to parse question options JSON string:", e, options);
      return []; // Return empty array on parsing error
    }
  } else if (Array.isArray(options)) {
    // If it's already an array, ensure elements are strings
    return options.filter(item => typeof item === 'string');
  }

  return []; // Default to empty array if options are not a string or array
}
