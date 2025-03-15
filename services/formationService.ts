import axiosInstance from "@/lib/axios";

export const fetchFormations = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axiosInstance.get("/formations", config);
  console.log(response.data)
  return response.data;
};

export const deleteFormation = async (token: string, formationId: number) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  await axiosInstance.delete(`/formations/${formationId}`, config);
};
