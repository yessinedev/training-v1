import axiosInstance from "@/lib/axios";
import { Formateur } from "@/types";

export const createOrUpdateFormateur = async (
  token: string,
  data: Partial<Formateur>,
  isEditing: boolean,
  formateurId?: string
): Promise<Formateur> => { 
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
console.log("Formateur data:", data);
  try {
    if (isEditing) {
      if (formateurId === undefined) {
        throw new Error("Formateur ID is required for editing.");
      }
      const response = await axiosInstance.put(`/formateurs/${formateurId}`, data, config);
      return response.data as Formateur; // Cast to specific type
    } else {
      const response = await axiosInstance.post("/formateurs", data, config);
      return response.data as Formateur; // Cast to specific type
    }
  } catch (error) {
    console.error("Error in createOrUpdateFormateur:", error);
    throw error;
  }
};

export const fetchFormateurs = async (token: string): Promise<Formateur[]> => { // Use specific type
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axiosInstance.get("/formateurs", config);
  return response.data as Formateur[]; // Cast to specific type
}
