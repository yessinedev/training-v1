import axiosInstance from "@/lib/axios";

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
