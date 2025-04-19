import axiosInstance from "@/lib/axios";
import { Survey } from "@/types";

export const fetchSurveys = async (token: string): Promise<Survey[]> => {
  const response = await axiosInstance.get("/surveys", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export type CreateSurveyPayload = {
  title: string;
  description?: string;
  createdById: string;
};

export const createSurvey = async (
  token: string,
  payload: CreateSurveyPayload
): Promise<Survey> => {
  console.log("Creating survey with payload:", payload);
  try {
    const response = await axiosInstance.post("/surveys", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating survey:", error);
    throw error;
  }
};

export const fetchSurveyById = async (
  token: string,
  surveyId: string
): Promise<Survey> => {
  const response = await axiosInstance.get(`/surveys/${surveyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateSurvey = async (
  token: string,
  surveyId: string,
  surveyData: Partial<Survey>
): Promise<Survey> => {
  try {
    console.log(surveyData.questions)
    const response = await axiosInstance.put(
      `/surveys/${surveyId}`,
      surveyData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating survey:", error);
    throw error;
  }
};
