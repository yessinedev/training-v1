import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatDate } from "@/lib/utils"
import { Participant } from "@/types"

interface AttendanceStatusProps {
  participant: Participant
}

export function AttendanceStatus({ participant }: AttendanceStatusProps) {
  // Group presences by action/formation
  const presencesByFormation = (participant.presences ?? []).reduce(
    (acc, presence) => {
      const actionId = presence.seance.action_id

      if (!acc[actionId]) {
        const action = participant?.actions?.find((a) => a.action_id === actionId)?.action
        if (!action) return acc

        acc[actionId] = {
          action_id: actionId,
          formation: action.theme.libelle_theme,
          domaine: action.theme.domaine.libelle_domaine,
          totalSessions: action.seances?.length ?? 0,
          attendedSessions: 0,
          presences: [],
        }
      }

      if (presence.status === "PRESENT") {
        acc[actionId].attendedSessions += 1
      }

      acc[actionId]?.presences?.push(presence)
      return acc
    },
    {} as Record<
      number,
      {
        action_id: number
        formation: string
        domaine: string
        totalSessions: number
        attendedSessions: number
        presences: typeof participant.presences
      }
    >,
  )

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Attendance Status</h3>

      {Object.keys(presencesByFormation).length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No attendance records found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.values(presencesByFormation).map((formationData) => (
            <Card key={formationData.action_id}>
              <CardHeader>
                <CardTitle className="text-lg">{formationData.formation}</CardTitle>
                <CardDescription>{formationData.domaine}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Attendance Rate</span>
                    <span className="text-sm font-medium">
                      {Math.round((formationData.attendedSessions / formationData.totalSessions) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(formationData.attendedSessions / formationData.totalSessions) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {formationData.attendedSessions} of {formationData.totalSessions} sessions attended
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Session Details</h4>
                  <div className="grid gap-2">
                    {formationData?.presences?.map((presence) => (
                      <div
                        key={presence.presence_id}
                        className="flex justify-between items-center py-2 border-b last:border-0"
                      >
                        <div>
                          <p className="text-sm">
                            {presence.seance.date ? formatDate(presence.seance.date) : "N/A"}
                            {presence.seance.heure ? ` at ${presence.seance.heure}` : ""}
                          </p>
                        </div>
                        <Badge variant={presence.status === "PRESENT" ? "default" : "destructive"}>
                          {presence.status === "PRESENT" ? "Present" : "Absent"}
                        </Badge>
                      </div>
                    ))}
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
