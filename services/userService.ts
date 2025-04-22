import axiosInstance from "@/lib/axios";
import { User } from "@/types";

export const fetchUsers = async (token: string, roleId?: string) => {
  try {
    const response = await axiosInstance.get("/users/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: roleId ? { roleId } : {},
    });
    return response.data;
  } catch (error) {
    throw error;
  }
  
};

export const fetchUserById = async (token: string, userId: string) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (userData: Omit<User, "user_id" | "role">) => {
  try {
    const response = await axiosInstance.post("/users/create", userData);
  return response.data;
  } catch (error) {
    throw error;
  }
  
};

export const updateUser = async (userId: string, userData: Partial<User>) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}`, userData);
  return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (token: string, userId: string) => {
  try {
    await axiosInstance.delete(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
};
