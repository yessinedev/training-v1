import axiosInstance from "@/lib/axios";

export const fetchUsers = async (token: string) => {
    const response = await axiosInstance.get("/user/all", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };


export const deleteUser = async (token: string, userId: string) => {
    await axiosInstance.delete(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };