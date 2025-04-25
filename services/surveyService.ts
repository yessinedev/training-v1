import axiosInstance from "@/lib/axios";
import { Survey } from "@/types";

export const fetchSurveys = async (): Promise<Survey[]> => {
  try {
    const response = await axiosInstance.get("/surveys");
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la récupération des enquêtes");
  }
};

export type CreateSurveyPayload = {
  title: string;
  description?: string;
  createdById: string;
};

export const createSurvey = async (
  payload: CreateSurveyPayload
): Promise<Survey> => {
  console.log("Creating survey with payload:", payload);
  try {
    const response = await axiosInstance.post("/surveys", payload);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la création de l'enquête");
  }
};

export const fetchSurveyById = async (surveyId: string): Promise<Survey> => {
  try {
    const response = await axiosInstance.get(`/surveys/${surveyId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la récupération de l'enquête");
  }
};

export const updateSurvey = async (
  surveyId: string,
  surveyData: Partial<Survey>
): Promise<Survey> => {
  try {
    const response = await axiosInstance.put(
      `/surveys/${surveyId}`,
      surveyData
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la mise à jour de l'enquête");
  }
};
