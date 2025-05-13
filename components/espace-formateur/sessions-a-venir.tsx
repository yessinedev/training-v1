"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchFormationsByFormateurId } from "@/services/formateurService";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";

export function SessionsAVenir({
  formateurId,
  limit,
}: {
  formateurId: string;
  limit?: number;
}) {
  const { data: formations = [], isLoading: isLoadingFormations } = useQuery({
    queryKey: ["formations-formateur", formateurId],
    queryFn: () => fetchFormationsByFormateurId(formateurId),
    enabled: !!formateurId,
  });

  const sessions = formations
    .flatMap((formation) => formation.action?.seances || [])
    .filter((session) => session.date && new Date(session.date) > new Date())
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

  const displayedSessions = limit ? sessions.slice(0, limit) : sessions;

  return (
    <div className="space-y-4">
      {displayedSessions.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          Aucune session à venir
        </p>
      ) : (
        displayedSessions.map((session) => {
          const sessionDate = session.date ? new Date(session.date) : null;
          const isToday = sessionDate
            ? sessionDate.toDateString() === new Date().toDateString()
            : false;

          return (
            <div
              key={session.seance_id}
              className="flex items-start space-x-4 rounded-lg border p-3"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    {session?.action?.theme.libelle_theme}
                  </h3>
                  <Badge variant={isToday ? "destructive" : "outline"}>
                    {isToday ? "Aujourd'hui" : "À venir"}
                  </Badge>
                </div>
                <div className="mt-1 flex flex-col space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-3.5 w-3.5" />
                    <span>{sessionDate?.toLocaleDateString("fr-FR")}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-3.5 w-3.5" />
                    <span>
                      {session.heure} ({session.duree_heures}h)
                    </span>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="ghost" asChild>
                <Link href={`/formateur/sessions/${session.seance_id}`}>
                  Détails
                </Link>
              </Button>
            </div>
          );
        })
      )}

      {limit && sessions.length > limit && (
        <Button variant="outline" asChild className="w-full">
          <Link href="/formateur/sessions">Voir toutes les sessions</Link>
        </Button>
      )}
    </div>
  );
}
