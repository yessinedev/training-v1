import axiosInstance from "@/lib/axios";

export const fetchUsers = async (token: string, roleId?: string) => {
  const response = await axiosInstance.get("/user/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: roleId ? { roleId } : {},
  });
  return response.data;
};



export const deleteUser = async (token: string, userId: string) => {
    await axiosInstance.delete(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };