"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchSeancesByFormateurId } from "@/services/seanceService";
import { Seance } from "@/types";

export function SessionsTable({ formateurId }: { formateurId: string }) {
  const { data: sessions, isLoading: isLoadingFormation } = useQuery<Seance[]>({
    queryKey: ["seances-formateur", formateurId],
    queryFn: () => fetchSeancesByFormateurId(formateurId),
    enabled: !!formateurId,
  });

  if (isLoadingFormation) {
    return <div>Chargement...</div>;
  }
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Formation</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Heure</TableHead>
            <TableHead>Durée</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions && sessions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Aucune session trouvée
              </TableCell>
            </TableRow>
          ) : (
            sessions && sessions.map((session) => {
              let statusLabel = "";
              let variant: "default" | "secondary" | "destructive" | "outline" =
                "default";

              switch (session.statut) {
                case "EN_ATTENTE":
                  statusLabel = "En attente";
                  variant = "outline";
                  break;
                case "EN_COURS":
                  statusLabel = "En cours";
                  variant = "default";
                  break;
                case "TERMINEE":
                  statusLabel = "Terminée";
                  variant = "secondary";
                  break;
                case "ANNULEE":
                  statusLabel = "Annulée";
                  variant = "destructive";
                  break;
              }

              return (
                <TableRow key={session.seance_id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {session?.action?.theme.libelle_theme}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>
                        {session.date
                          ? new Date(session.date).toLocaleDateString("fr-FR")
                          : "Non programmée"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{session.heure || "Non définie"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{session.duree_heures} heures</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={variant}>{statusLabel}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" asChild>
                      <Link href={`/espace-formateur/sessions/${session.seance_id}`}>
                        Gérer
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
