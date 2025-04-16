import axiosInstance from "@/lib/axios";

export const fetchUsers = async (token: string, roleId?: string) => {
  const response = await axiosInstance.get("/users/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: roleId ? { roleId } : {},
  });
  return response.data;
};



export const deleteUser = async (token: string, userId: string) => {
    await axiosInstance.delete(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };