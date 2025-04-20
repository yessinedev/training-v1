import axiosInstance from "@/lib/axios";
import { User } from "@/types";

export const fetchUsers = async (token: string, roleId?: string) => {
  const response = await axiosInstance.get("/users/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: roleId ? { roleId } : {},
  });
  return response.data;
};

export const fetchUserById = async (token: string, userId: string) => {
  const response = await axiosInstance.get(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createUser = async (userData: Omit<User, "user_id" | "role">) => {
  const response = await axiosInstance.post("/users/create", userData);
  return response.data;
};

export const updateUser = async (userId: string, userData: Partial<User>) => {
  const response = await axiosInstance.put(`/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (token: string, userId: string) => {
  await axiosInstance.delete(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
