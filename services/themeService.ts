import axiosInstance from "@/lib/axios";

export const fetchThemes = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axiosInstance.get("/themes", config);
  return response.data;
};

export const deleteTheme = async (token: string, themeId: number) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  await axiosInstance.delete(`/themes?id=${themeId}`, config);
};
