import axiosInstance from "@/lib/axios";
import { Seance } from "@/types";

export const fetchSeances = async () => {
  const response = await axiosInstance.get("/seances");
  return response.data;
};

export const fetchSeanceById = async (seanceId: number) => {
  const response = await axiosInstance.get(`/seances/${seanceId}`);
  return response.data;
};

export const fetchSeancesByFormationId = async (formationId: number) => {
  const response = await axiosInstance.get(`/seances/formation/${formationId}`);
  return response.data;
};

export const createSeance = async (seance: Omit<Seance, "seance_id">) => {
  try {
    const response = await axiosInstance.post("/seances", seance);
    return response.data;
  } catch (error) {
    console.error("Error creating seance:", error);
    throw error;
  }
};

export const updateSeance = async (seance: Seance) => {
  const response = await axiosInstance.put(
    `/seances/${seance.seance_id}`,
    seance
  );
  return response.data;
};

export const deleteSeance = async (seanceId: number) => {
  const response = await axiosInstance.delete(`/seances/${seanceId}`);
  return response.data;
};
