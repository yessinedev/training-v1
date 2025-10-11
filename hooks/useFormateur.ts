import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { fetchFormateurById } from "@/services/formateurService";

export function useFormateur() {
  const { user, isLoaded, isSignedIn } = useUser();

  const userId = user?.id;

  const {
    data: formateur,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["formateur", userId],
    queryFn: () => fetchFormateurById(userId!),
    enabled: !!userId,
  });


  return {
    formateur,
    isLoading: isLoading || !isLoaded,
    isError,
    error,
    isSignedIn,
    user,
  };
}