import axiosInstance from "@/lib/axios";
import { Seance } from "@/types";

export const fetchSeances = async (): Promise<Seance[]> => {
  try {
    const response = await axiosInstance.get("/seances");
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la récupération des séances");
  }
};

export const fetchSeanceById = async (seanceId: number): Promise<Seance> => {
  try {
    const response = await axiosInstance.get(`/seances/${seanceId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la récupération de la séance");
  }
};

export const fetchSeancesByFormationId = async (formationId: number) => {
  try {
    const response = await axiosInstance.get(
      `/seances/formation/${formationId}`
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la récupération des séances par formation");
  }
};

export const fetchSeancesByFormateurId = async (formateurId: string) => {
  try {
    const response = await axiosInstance.get(
      `/seances/formateur/${formateurId}`
    );
    return response.data;
  }catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la récupération des séances par formateur");
  }
}

export const createSeance = async (seance: Omit<Seance, "seance_id">) => {
  try {
    const response = await axiosInstance.post("/seances", seance);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la création de la séance");
  }
};

export const updateSeance = async (seance: Seance) => {
  try {
    const response = await axiosInstance.put(
      `/seances/${seance.seance_id}`,
      seance
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la mise à jour de la séance");
  }
};

export const deleteSeance = async (seanceId: number) => {
  try {
    const response = await axiosInstance.delete(`/seances/${seanceId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la suppression de la séance");
  }
};
