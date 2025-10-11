import { createOrUpdateFormateur } from "@/services/formateurService";
import { Formateur } from "@/types";
import { useMutation } from "@tanstack/react-query";

export const useFormateurMutation = (
  isEditing: boolean,
  formateurId: string | undefined,
  onSuccess: () => void,
  onError: (error: Error) => void
) => {
  return useMutation({
    mutationFn: (formData: Partial<Formateur>) =>
      createOrUpdateFormateur(formData, isEditing, formateurId),

    onSuccess,
    onError: (error: unknown) => {
      let errorToReport: Error;
      if (error instanceof Error) {
        errorToReport = error;
      } else {
        errorToReport = new Error(String(error));
      }
      onError(errorToReport);
    },
  });
};
