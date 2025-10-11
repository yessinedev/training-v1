import axiosInstance from "@/lib/axios";
import { ActionFormationFormateur, Formateur } from "@/types";

export const createOrUpdateFormateur = async (
  data: Partial<Formateur>,
  isEditing: boolean,
  formateurId?: string
): Promise<Formateur> => {
  try {
    if (isEditing) {
      if (formateurId === undefined) {
        throw new Error("Formateur ID is required for editing.");
      }
      const response = await axiosInstance.put(
        `/formateurs/${formateurId}`,
        data
      );
      return response.data as Formateur;
    } else {
      const response = await axiosInstance.post("/formateurs", data);
      return response.data as Formateur;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(
      "Erreur lors de la création ou de la mise à jour du formateur"
    );
  }
};

export const fetchFormateurs = async (): Promise<Formateur[]> => {
  try {
    const response = await axiosInstance.get("/formateurs");
    return response.data as Formateur[];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la récupération des formateurs");
  }
};

export const fetchFormateurById = async (
  formateurId: string
): Promise<Formateur> => {
  try {
    const response = await axiosInstance.get(`/formateurs/${formateurId}`);
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la récupération du formateur");
  }
};

export const deleteFormateur = async (formateurId: string) => {
  try {
    await axiosInstance.delete(`/formateurs/${formateurId}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la suppression du formateur");
  }
};

export const fetchFormationsByFormateurId = async (
  formateurId: string
): Promise<ActionFormationFormateur[]> => {
  try {
    const response = await axiosInstance.get(`aff/formateur/${formateurId}`);
    return response.data as ActionFormationFormateur[];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la récupération du formateur");
  }
};
