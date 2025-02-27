import { useAuthMutation } from "@/hooks/useAuthMutation";
import { createOrUpdateFormateur } from "@/services/formateurService";

export const useFormateurMutation = (isEditing: boolean, onSuccess: () => void, onError: (error: Error) => void) => {
  return useAuthMutation(
    (token: string, formData: FormData) => createOrUpdateFormateur(token, formData, isEditing),
    { 
      onSuccess, 
      onError: (error: unknown) => onError(error as Error) 
    }
  );
};
