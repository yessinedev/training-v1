import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Participant, Seance } from "@/types"

interface SessionScheduleProps {
  participant: Participant
}

export function SessionSchedule({ participant }: SessionScheduleProps) {
  // Get all sessions from all formations the participant is enrolled in
  console.log("participant", participant)
  const sessions = participant?.actions?.flatMap((action) =>
    action?.action?.seances?.map((seance) => ({
      ...seance,
      formation: action.action.theme.libelle_theme,
      domaine: action.action.theme.domaine.libelle_domaine,
    })),
  )

  console.log(sessions)

  // Sort sessions by date
  const sortedSessions = (sessions?.filter((s): s is NonNullable<typeof s> => s !== undefined) || []).sort((a, b) => {
    if (!a?.date || !b?.date) return 0
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  // Group sessions by date
  const sessionsByDate = sortedSessions.reduce(
    (acc, session) => {
      if (!session.date) return acc

      const dateKey = formatDate(session.date)
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(session)
      return acc
    },
    {} as Record<string, typeof sortedSessions>,
  )

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Session Schedule</h3>

      {Object.keys(sessionsByDate).length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No upcoming sessions scheduled.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(sessionsByDate).map(([date, sessions]) => (
            <div key={date} className="space-y-3">
              <h4 className="font-medium">{date}</h4>
              <div className="grid gap-3">
                {sessions.map((session) => (
                  <Card key={session.seance_id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <h5 className="font-medium">{formatDate(session.date)}</h5>
                          <p className="text-sm text-muted-foreground">{session.action?.theme.domaine.libelle_domaine}</p>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                          <div className="text-sm">
                            <span className="font-medium">{session.heure}</span>
                            <span className="text-muted-foreground"> ({session.duree_heures} hours)</span>
                          </div>
                          <Badge variant={getStatusVariant(session.statut)}>{formatStatus(session.statut)}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatStatus(status: string): string {
  switch (status) {
    case "EN_ATTENTE":
      return "Pending"
    case "EN_COURS":
      return "In Progress"
    case "TERMINEE":
      return "Completed"
    case "ANNULEE":
      return "Cancelled"
    default:
      return status
  }
}

function getStatusVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "EN_ATTENTE":
      return "outline"
    case "EN_COURS":
      return "secondary"
    case "TERMINEE":
      return "default"
    case "ANNULEE":
      return "destructive"
    default:
      return "outline"
  }
}
