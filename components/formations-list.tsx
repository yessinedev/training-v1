import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, MapPin, Users } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Participant } from "@/types"

interface FormationsListProps {
  participant: Participant
}

export function FormationsList({ participant }: FormationsListProps) {
  console.log(participant)
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Your Formations</h3>

      {participant?.actions?.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">You are not enrolled in any formations yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {participant?.actions?.map((action) => (
            <Card key={action.action_id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{action.action.theme.libelle_theme}</CardTitle>
                  <Badge variant={getStatusVariant(action.statut || "")}>{action.statut || "Enrolled"}</Badge>
                </div>
                {/* <CardDescription>{action.action.theme.domaine.libelle_domaine}</CardDescription> */}
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {formatDate(action.action.date_debut)} - {formatDate(action.action.date_fin)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {action.action.duree_heures} hours ({action.action.duree_jours} days)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{action.action.lieu}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{action.action.nb_participants_prevu} participants</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function getStatusVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  switch (status.toLowerCase()) {
    case "completed":
      return "default"
    case "in progress":
      return "secondary"
    case "cancelled":
      return "destructive"
    default:
      return "outline"
  }
}
