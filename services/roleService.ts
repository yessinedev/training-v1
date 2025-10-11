import axiosInstance from "@/lib/axios";

export const fetchRoles = async () => {
  try {
    const { data } = await axiosInstance.get("/roles");
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Un erreur est survenu lors de la récupération des rôles.");
  }
};

export const createRole = async (payload: { role_name: string }) => {
  try {
    const response = await axiosInstance.post("/roles", payload);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Un erreur est survenu lors de la création du rôle.");
  }
};

export const updateRole = async (
  roleId: number,
  payload: { role_name: string }
) => {
  try {
    const response = await axiosInstance.put(`/roles/${roleId}`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Un erreur est survenu lors de la mise à jour du rôle.");
  }
};

export const deleteRole = async (roleId: number) => {
  try {
    await axiosInstance.delete(`/roles/${roleId}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Un erreur est survenu lors de la suppression du rôle.");
  }
};
