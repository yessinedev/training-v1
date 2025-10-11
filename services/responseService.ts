import axiosInstance from "@/lib/axios";
import { CreateResponse, Response } from "@/types";

export const createResponse = async (
  payload: CreateResponse
): Promise<Response> => {
    console.log(payload)
  try {
    const response = await axiosInstance.post("/responses", payload);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
        console.log(error)
      throw new Error(error.message);
    }
    throw new Error("Error while creating the response");
  }
};

export const fetchResponses = async (): Promise<Response[]> => {
  try {
    const response = await axiosInstance.get("/responses");
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error while fetching responses");
  }
};

export const fetchResponseById = async (
  responseId: string
): Promise<Response> => {
  try {
    const response = await axiosInstance.get(`/responses/${responseId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error while fetching the response");
  }
};

export const fetchResponsesBySurveyId = async (
  surveyId: string
): Promise<Response[]> => {
  try {
    const response = await axiosInstance.get(`/responses/survey/${surveyId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error while fetching responses for this survey");
  }
};

export const fetchResponsesByParticipantId = async (
  participantId: string
): Promise<Response[]> => {
  try {
    const response = await axiosInstance.get(
      `/responses/participant/${participantId}`
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error while fetching responses for this participant");
  }
};

export const updateResponse = async (
  responseId: string,
  responseData: Partial<Response>
): Promise<Response> => {
  try {
    const response = await axiosInstance.patch(
      `/responses/${responseId}`,
      responseData
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error while updating the response");
  }
};

export const deleteResponse = async (responseId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/responses/${responseId}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error while deleting the response");
  }
};
