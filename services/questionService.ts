import axiosInstance from "@/lib/axios";

export const deleteQuestion = async (questionId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/questions/${questionId}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la suppression de la question");
  }
};
