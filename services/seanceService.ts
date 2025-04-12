import axiosInstance from "@/lib/axios";

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
    

// export const createDomaine = async (data: FormValues) => {
//   const response = await axiosInstance.post("/seances", data);
//   return response.data;
// };

// export const updateDomaine = async (domainId: number, data: FormValues) => {
//   const response = await axiosInstance.put(`/domaines/${domainId}`, data);
//   return response.data;
// };

// export const deleteDomaine = async (token: string, domainId: number) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   await axiosInstance.delete(`/domaines/${domainId}`, config);
// };
