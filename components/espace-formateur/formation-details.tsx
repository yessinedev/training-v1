"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { ActionFormation } from "@/lib/types"
import { Calendar, Clock, MapPin, Users } from "lucide-react"

interface FormationDetailsProps {
  formation: ActionFormation
}

export function FormationDetails({ formation }: FormationDetailsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations générales</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Thème</dt>
                <dd className="mt-1">{formation.theme.libelle_theme}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Type d'action</dt>
                <dd className="mt-1">{formation.type_action}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Période</dt>
                  <dd className="mt-1">
                    {new Date(formation.date_debut).toLocaleDateString("fr-FR")} -{" "}
                    {new Date(formation.date_fin).toLocaleDateString("fr-FR")}
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Durée</dt>
                  <dd className="mt-1">
                    {formation.duree_jours} jours ({formation.duree_heures} heures)
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Détails supplémentaires</h3>
            <dl className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Lieu</dt>
                  <dd className="mt-1">{formation.lieu}</dd>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Participants</dt>
                  <dd className="mt-1">
                    {formation.participants.length} / {formation.nb_participants_prevu || "Non défini"}
                  </dd>
                </div>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Nombre de séances</dt>
                <dd className="mt-1">{formation.nb_seances || "Non défini"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Prix unitaire</dt>
                <dd className="mt-1">
                  {formation.prix_unitaire ? `${formation.prix_unitaire.toFixed(2)} €` : "Non défini"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
