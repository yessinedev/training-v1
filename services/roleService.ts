import axiosInstance from "@/lib/axios";

export const fetchRoles = async (token?: string) => {
  try {
    const { data } = await axiosInstance.get("/roles", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
