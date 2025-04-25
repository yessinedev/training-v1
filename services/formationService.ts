import axiosInstance from "@/lib/axios";
import { FormationPayload, Participant } from "@/types";

export const fetchFormations = async () => {
  try {
    const response = await axiosInstance.get("/formations");
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la récuperation des formations");
  }
};

export const fetchFormationById = async (formationId: number) => {
  try {
    const response = await axiosInstance.get(`/formations/${formationId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la récupération de la formation");
  }
};

export const createFormation = async (payload: FormationPayload) => {
  try {
    const response = await axiosInstance.post("/formations", payload);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la création de la formation");
  }
};

export const updateFormation = async (
  actionId: number,
  payload: FormationPayload
) => {
  try {
    const response = await axiosInstance.put(
      `/formations/${actionId}`,
      payload
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la mise à jour de la formation");
  }
};

export const deleteFormation = async (formationId: number) => {
  try {
    await axiosInstance.delete(`/formations/${formationId}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la suppression de la formation");
  }
};

export const fetchFormateursByFormationId = async (actionId: number) => {
  try {
    const response = await axiosInstance.get(
      `/formations/${actionId}/formateurs`
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la récupération des formateurs");
  }
};

export const assignFormateurToFormation = async (
  formationId: number,
  data: {
    formateur_id: string;
  }
) => {
  try {
    const response = await axiosInstance.post(
      `/formations/${formationId}/formateurs`,
      { formateurId: data.formateur_id }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de l'ajout du formateur à la formation");
  }
};

export const removeFormateurFromFormation = async (
  actionId: number,
  formateurId: string
) => {
  try {
    await axiosInstance.delete(
      `/formations/${actionId}/formateurs?formateurId=${formateurId}`
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(
      "Erreur lors de la suppression du formateur de la formation"
    );
  }
};

export const createParticipantsForFormation = async (formationId: number, data: Participant[]) => {
  try {
    const response = await axiosInstance.post(
      `/formations/${formationId}/participants`,
      data
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la création du participant");
  }
};

export const fetchParticipantsByFormationId = async (actionId: number) => {
  try {
    const response = await axiosInstance.get(
      `/formations/${actionId}/participants`
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la récupération des participants");
  }
};

export const removeParticipantFromFormation = async (
  actionId: number,
  { participantId }: { participantId: string }
) => {
  try {
    await axiosInstance.delete(
      `/formations/${actionId}/participants?participantId=${participantId}`
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(
      "Erreur lors de la suppression du participant de la formation"
    );
  }
};

export const updateParticipantStatus = async (
  { participant_id, statut }: { participant_id: string; statut: string },
  formationId: number
) => {
  try {
    const response = await axiosInstance.put(
      `/formations/${formationId}/participants`,
      {
        participant_id,
        statut,
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la mise à jour du participant");
  }
};
