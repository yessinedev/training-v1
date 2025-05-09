"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Formation } from "@/types"

interface ParticipantsFormationProps {
  formation: Formation
}

export function ParticipantsFormation({ formation }: ParticipantsFormationProps) {
  const participants = formation.participants
console.log(participants)
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Participant</TableHead>
            <TableHead>Entreprise</TableHead>
            <TableHead>Poste</TableHead>
            <TableHead>Date d'inscription</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Aucun participant inscrit
              </TableCell>
            </TableRow>
          ) : (
            participants.map((participant) => {
              const statusLabel = participant.statut || "Inscrit"
              let variant: "default" | "secondary" | "destructive" | "outline" = "default"

              switch (participant.statut) {
                case "Confirmé":
                  variant = "default"
                  break
                case "En attente":
                  variant = "outline"
                  break
                case "Annulé":
                  variant = "destructive"
                  break
                case "Terminé":
                  variant = "secondary"
                  break
              }

              return (
                <TableRow key={participant.participant_id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {participant.participant.user.prenom.charAt(0)}
                          {participant.participant.user.nom.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {participant.participant.user.prenom} {participant.participant.user.nom}
                        </div>
                        <div className="text-sm text-muted-foreground">{participant.participant.user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{participant.participant.entreprise}</TableCell>
                  <TableCell>{participant.participant.poste}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>
                        {participant.date_inscription
                          ? new Date(participant.date_inscription).toLocaleDateString("fr-FR")
                          : "Non définie"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={variant}>{statusLabel}</Badge>
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
