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
