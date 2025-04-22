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
  const response = await axiosInstance.post("/participants", data, config);
  return response.data;
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
