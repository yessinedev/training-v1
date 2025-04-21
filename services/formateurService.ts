import axiosInstance from "@/lib/axios";


export const createOrUpdateFormateur = async (
  token: string,
  data: FormData,
  isEditing: boolean
): Promise<any> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  if (isEditing) {
    const response = await axiosInstance.put("/formateurs", data, config);
    return response.data;
  } else {
    try {
      const response = await axiosInstance.post("/formateurs", data, config);
    return response.data;
    } catch (error) {
      throw error;
    }
    
  }
};


export const fetchFormateurs = async (token: string): Promise<any> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axiosInstance.get("/formateurs", config);
  return response.data;
}
