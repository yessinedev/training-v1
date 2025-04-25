import axiosInstance from "@/lib/axios";
import { Theme } from "@/types";

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
