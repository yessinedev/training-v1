import axiosInstance from "@/lib/axios";
import { CreateParticipant, Participant } from "@/types";

export const createParticipant = async (data: CreateParticipant) => {
  try {
    const response = await axiosInstance.post("/participants/create", data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la création du participant");
  }
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
      `/formations/${formationId}/participants`,
      participantsWithStatus
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de l'ajout des participants à la formation");
  }
};

export const fetchParticipants = async (): Promise<Participant[]> => {
  try {
    const response = await axiosInstance.get("/participants");
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la récupération des participants");
  }
};

export const updateParticipant = async (
  participantId: string,
  data: CreateParticipant
) => {
  try {
    const response = await axiosInstance.put(
      `/participants/${participantId}`,
      data
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la mise à jour du participant");
  }
};

export const deleteParticipant = async (participantId: string) => {
  try {
    await axiosInstance.delete(`/participants/${participantId}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la suppression du participant");
  }
};
