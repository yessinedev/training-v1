import axiosInstance from "@/lib/axios";
import { CreateParticipant} from "@/types";

export const createOrUpdateParticipant = async(token: string, data: CreateParticipant, isEditiong: boolean ) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }

  if (isEditiong) {
    await axiosInstance.put("/participants", data, config);
  } else {
    await axiosInstance.post("/participants/create", data, config);
  }
}

export const fetchParticipants = async (token: string): Promise<any> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axiosInstance.get("/participants", config);
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
