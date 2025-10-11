"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
// Replace the mock import with your real service
// import { getMockFormationsFormateur, getMockSeancesFormateur } from "@/lib/mock-data"
import { fetchFormationsByFormateurId } from "@/services/formateurService";
// You may need to get the formateurId from context, props, or authentication
// For this example, let's assume you receive it as a prop

export function StatistiquesFormateur({
  formateurId,
}: {
  formateurId: string;
}) {
  const { data: formations = [], isLoading: isLoadingFormations } = useQuery({
    queryKey: ["formations-formateur", formateurId],
    queryFn: () => fetchFormationsByFormateurId(formateurId),
    enabled: !!formateurId,
  });

  const sessions = formations.flatMap(
    (formation) => formation.action?.seances || []
  );

  const sessionsAVenir = sessions.filter(
    (session) => session.date && new Date(session.date) > new Date()
  )?.length;

  // Calculer le nombre total de participants
  const totalParticipants = formations.reduce(
    (total, formation) => total + (formation.action?.participants.length || 0),
    0
  );



  if (isLoadingFormations) {
    return <div>Chargement des statistiques...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Formations actives
          </CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formations.length}</div>
          <p className="text-xs text-muted-foreground">Formations en cours</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Sessions à venir
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sessionsAVenir}</div>
          <p className="text-xs text-muted-foreground">
            Prochaines sessions programmées
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Participants</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalParticipants}</div>
          <p className="text-xs text-muted-foreground">Participants actifs</p>
        </CardContent>
      </Card>
    </>
  );
}
import { BookOpen, Calendar, Users } from "lucide-react";
