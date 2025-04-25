import axiosInstance from "@/lib/axios";
import { Formateur } from "@/types";

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
