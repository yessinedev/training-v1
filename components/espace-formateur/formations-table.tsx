"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getMockFormationsFormateur } from "@/lib/mock-data"
import { Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { useFormateur } from "@/hooks/useFormateur"
import { useQuery } from "@tanstack/react-query"
import { fetchFormationsByFormateurId } from "@/services/formateurService"

export function FormationsTable() {
  const { isLoading, formateur,  } = useFormateur();

  const { data: formations = [], isLoading: isLoadingFormations } = useQuery({
    queryKey: ["formations-formateur", formateur?.user_id],
    queryFn: () => fetchFormationsByFormateurId(formateur?.user_id!),
    enabled: !!formateur?.user_id,
  });
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Formation</TableHead>
            <TableHead>Période</TableHead>
            <TableHead>Lieu</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Aucune formation trouvée
              </TableCell>
            </TableRow>
          ) : (
            formations.map((formation) => {
              // Calculer le statut
              const now = new Date()
              const start = new Date(formation.action.date_debut)
              const end = new Date(formation.action.date_fin)
              let status = "En cours"
              let variant: "default" | "secondary" | "outline" = "default"

              if (now < start) {
                status = "À venir"
                variant = "outline"
              } else if (now > end) {
                status = "Terminée"
                variant = "secondary"
              }

              return (
                <TableRow key={formation.action_id}>
                  <TableCell className="font-medium">{formation.action.theme.libelle_theme}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(formation.action.date_debut).toLocaleDateString("fr-FR")} -{" "}
                        {new Date(formation.action.date_fin).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{formation.action.duree_heures} heures</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{formation.action.lieu}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {formation.action.participants.length} / {formation.action.nb_participants_prevu || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={variant}>{status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" asChild>
                      <Link href={`/espace-formateur/formations/${formation.action_id}`}>Détails</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
