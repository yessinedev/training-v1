import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { fetchParticipantById } from "@/services/participantService";

export function useParticipant() {
  const { user, isLoaded, isSignedIn } = useUser();

  const userId = user?.id;

  const {
    data: participant,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["participant", userId],
    queryFn: () => fetchParticipantById(userId!),
    enabled: !!userId,
  });

  return {
    participant,
    isLoading: isLoading || !isLoaded,
    isError,
    error,
    isSignedIn,
    user,
  };
}