"use client"

import { Badge } from "@/components/ui/badge"
import { Seance } from "@/types"
import { Calendar, Clock, FileText, MapPin } from "lucide-react"

interface SessionDetailsProps {
  session: Seance
}

export function SessionDetails({ session }: SessionDetailsProps) {
  let statusLabel = ""
  let variant: "default" | "secondary" | "destructive" | "outline" = "default"

  switch (session.statut) {
    case "EN_ATTENTE":
      statusLabel = "En attente"
      variant = "outline"
      break
    case "EN_COURS":
      statusLabel = "En cours"
      variant = "default"
      break
    case "TERMINEE":
      statusLabel = "Terminée"
      variant = "secondary"
      break
    case "ANNULEE":
      statusLabel = "Annulée"
      variant = "destructive"
      break
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{session?.action?.theme.libelle_theme}</span>
        </div>
        <Badge variant={variant}>{statusLabel}</Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{session.date ? new Date(session.date).toLocaleDateString("fr-FR") : "Date non programmée"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {session.heure || "Heure non définie"} ({session.duree_heures} heures)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{session?.action?.lieu}</span>
        </div>
      </div>
    </div>
  )
}
