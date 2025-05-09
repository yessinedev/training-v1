'use client'
import { ParticipantDashboard } from "@/components/participant-dashboard"
import { useParticipant } from "@/hooks/useParticipant"

export default function Home() {

  const {
    participant,
    isLoading,
    isError,
  } = useParticipant();

  if (isLoading) {
    return <p>Loading…</p>;
  }

  if (isError || !participant) {
    return <p>Error loading participant data.</p>;
  }
  

  return <ParticipantDashboard participant={participant} />
}
