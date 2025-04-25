import axiosInstance from "@/lib/axios";
import { User } from "@/types";

export const fetchUsers = async (roleId?: string) => {
  try {
    const response = await axiosInstance.get("/users/all");
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la récupération des utilisateurs");
  }
};

export const fetchUserById = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la récupération de l'utilisateur");
  }
};

export const createUser = async (userData: Omit<User, "user_id" | "role">) => {
  try {
    const response = await axiosInstance.post("/users/create", userData);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la création de l'utilisateur");
  }
};

export const updateUser = async (userId: string, userData: Partial<User>) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la mise à jour de l'utilisateur");
  }
};

export const deleteUser = async (userId: string) => {
  try {
    await axiosInstance.delete(`/users/${userId}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la suppression de l'utilisateur");
  }
};
