import axiosInstance from "@/lib/axios";

export const fetchParticipants = async (token: string): Promise<any> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axiosInstance.get("/participant", config);
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
  await axiosInstance.delete(`/participants?id=${participantId}`, config);
};
