import axiosInstance from "@/lib/axios";


export const deleteQuestion = async (
  token: string,
  questionId: string
): Promise<void> => {
  await axiosInstance.delete(`/questions/${questionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};