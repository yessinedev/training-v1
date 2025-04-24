import axiosInstance from "@/lib/axios";
import { CreateParticipant } from "@/types";

export const createParticipant = async (
  data: CreateParticipant,
  token?: string
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axiosInstance.post("/participants/create", data, config);
  return response.data;
};

export const assignParticipantsToFormation = async (
  formationId: number,
  participantIds: string[]
): Promise<any> => { 
  const participantsWithStatus = participantIds.map((id) => ({
    participant_id: id,
    statut: "Confirmé", 
  }));
  try {
    const response = await axiosInstance.post(
      `/formations/${formationId}/participants`, participantsWithStatus
    );
    return response.data;
  } catch (error) {
    throw error; 
  }
};

export const fetchParticipants = async (token: string): Promise<any> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axiosInstance.get("/participants", config);
  return response.data;
};

export const updateParticipant = async (
  participantId: string,
  data: CreateParticipant,
  token?: string
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axiosInstance.put(
    `/participants/${participantId}`,
    data,
    config
  );
  return response.data;
};

export const deleteParticipant = async (
  token: string,
  participantId: string
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  await axiosInstance.delete(`/participants/${participantId}`, config);
};
