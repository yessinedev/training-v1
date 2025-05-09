"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { fetchFormationsByFormateurId } from "@/services/formateurService"
import { useQuery } from "@tanstack/react-query"
import { CalendarIcon, Users } from "lucide-react"
import Link from "next/link"

export function FormationsEnCours({ formateurId, limit }: { limit?: number, formateurId: string }) {
  const { data: formations = [], isLoading: isLoadingFormations } = useQuery({
    queryKey: ["formations-formateur", formateurId],
    queryFn: () => fetchFormationsByFormateurId(formateurId),
    enabled: !!formateurId,
  });
  const displayedFormations = limit ? formations.slice(0, limit) : formations

  return (
    <div className="space-y-4">
      {displayedFormations.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">Aucune formation en cours</p>
      ) : (
        displayedFormations.map((formation) => {
          // Calculer la progression
          const now = new Date()
          const start = new Date(formation.action.date_debut)
          const end = new Date(formation.action.date_fin)
          const total = end.getTime() - start.getTime()
          const elapsed = now.getTime() - start.getTime()
          const progress = Math.max(0, Math.min(100, (elapsed / total) * 100))

          return (
            <Card key={formation.action_id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{formation.action.theme.libelle_theme}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span>
                          {new Date(formation.action.date_debut).toLocaleDateString("fr-FR")} -{" "}
                          {new Date(formation.action.date_fin).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{formation.action.participants.length} participants</span>
                      </div>
                    </div>
                    <Badge variant={progress < 50 ? "default" : progress < 75 ? "secondary" : "outline"}>
                      {progress < 50 ? "En cours" : progress < 75 ? "Avancé" : "Fin proche"}
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Progression</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div className="mt-4">
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/espace-formateur/formations/${formation.action_id}`}>Voir les détails</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })
      )}

      {limit && formations.length > limit && (
        <Button variant="outline" asChild className="w-full">
          <Link href="/formateur/formations">Voir toutes les formations</Link>
        </Button>
      )}
    </div>
  )
}
