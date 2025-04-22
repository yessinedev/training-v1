import { useAuthMutation } from "@/hooks/useAuthMutation";
import { createOrUpdateFormateur } from "@/services/formateurService";
import { Formateur } from "@/types";

export const useFormateurMutation = (
  isEditing: boolean,
  formateurId: string | undefined,
  onSuccess: () => void,
  onError: (error: Error) => void
) => {
  return useAuthMutation(
    (token: string, formData: Partial<Formateur>) =>
      createOrUpdateFormateur(token, formData, isEditing, formateurId),
    {
      onSuccess,
      onError: (error: unknown) => {
        let errorToReport: Error;
        if (error instanceof Error) {
          errorToReport = error;
        } else {
          errorToReport = new Error(
            `An unexpected error occurred: ${String(error)}`
          );
        }
        onError(errorToReport);
      },
    }
  );
};
