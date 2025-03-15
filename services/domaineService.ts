import { FormValues } from "@/components/domains/domain-form";
import axiosInstance from "@/lib/axios";
import { Domain } from "@/types";

export const fetchDomaines = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axiosInstance.get("/domaines", config);
  return response.data;
};

export const createDomaine = async (data: FormValues) => {
  const response = await axiosInstance.post("/domaines", data);
  return response.data;
};

export const updateDomaine = async (domainId: number, data: FormValues) => {
  const response = await axiosInstance.put(`/domaines/${domainId}`, data);
  return response.data;
};

export const deleteDomaine = async (token: string, domainId: number) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  await axiosInstance.delete(`/domaines/${domainId}`, config);
};
