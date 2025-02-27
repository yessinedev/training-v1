import axiosInstance from "@/lib/axios";


export const createOrUpdateFormateur = async (
  token: string,
  data: FormData,
  isEditing: boolean
): Promise<any> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  if (isEditing) {
    const response = await axiosInstance.put("/formateurs", data, config);
    return response.data;
  } else {
    const response = await axiosInstance.post("/formateurs", data, config);
    return response.data;
  }
};
