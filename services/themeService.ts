import axiosInstance from "@/lib/axios";
import { Theme } from "@/types";

export type ThemePayload = {
  libelle_theme: string;
  domaine_id: number;
};

export const fetchThemes = async (): Promise<Theme[]> => {
  try {
    const response = await axiosInstance.get("/themes");
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la récupération des thèmes");
  }
};

export const createTheme = async (payload: ThemePayload): Promise<Theme> => {
  try {
    const response = await axiosInstance.post("/themes", payload);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la création du thème");
  }
};

export const updateTheme = async (themeId: number, payload: ThemePayload) => {
  try {
    const response = await axiosInstance.put(`/themes/${themeId}`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la mise à jour du thème");
  }
};

export const deleteTheme = async (themeId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/themes/${themeId}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la suppression du thème");
  }
};
