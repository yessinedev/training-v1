import { FormValues } from "@/components/domains/domain-form";
import axiosInstance from "@/lib/axios";
import { Domain } from "@/types";

export const fetchDomaines = async (): Promise<Domain[]> => {
  try {
    const response = await axiosInstance.get("/domaines");
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la récupération des domaines");
  }
};

export const createDomaine = async (data: FormValues): Promise<Domain> => {
  try {
    const response = await axiosInstance.post("/domaines", data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la création du domaine");
  }
};

export const updateDomaine = async (domainId: number, data: FormValues) => {
  try {
    const response = await axiosInstance.put(`/domaines/${domainId}`, data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la mise à jour du domaine");
  }
};

export const deleteDomaine = async (domainId: number) => {
  try {
    await axiosInstance.delete(`/domaines/${domainId}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la suppression du domaine");
  }
};
