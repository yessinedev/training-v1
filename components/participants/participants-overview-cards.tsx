"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Participant } from "@/types";
import { Users2Icon, BuildingIcon, GraduationCapIcon, ClockIcon } from "lucide-react";

interface ParticipantOverviewCardsProps {
  participants: Participant[];
}

export function ParticipantOverviewCards({ participants }: ParticipantOverviewCardsProps) {
  // Calculate statistics
  const totalParticipants = participants.length;

  // Count participants by company
  const companyDistribution = participants.reduce((acc, participant) => {
    acc[participant.entreprise as string] = (acc[participant.entreprise as string] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Count participants in active formations
  const activeInFormations = participants.filter(
    participant => participant.actions?.some(action => action.statut  === 'Confirmé')
  ).length;

  // Get most recent participant
  const mostRecentParticipant = participants[participants.length - 1];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="shadow-md border-b-[7px] border-primary hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Users2Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
              <h3 className="text-2xl font-bold">{totalParticipants} Participants</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-b-[7px] border-primary hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
              <BuildingIcon className="h-6 w-6 text-green-700 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Entreprises</p>
              <h3 className="text-2xl font-bold">
                {Object.keys(companyDistribution).length} Entreprises
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {Object.entries(companyDistribution)
                  .slice(0, 2)
                  .map(([company, count]) => `${company} (${count})`)
                  .join(", ")}
                {Object.keys(companyDistribution).length > 2 && "..."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-b-[7px] border-primary hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <GraduationCapIcon className="h-6 w-6 text-blue-700 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">En Formation</p>
              <h3 className="text-2xl font-bold">
                {activeInFormations} Actifs
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {((activeInFormations / totalParticipants) * 100).toFixed(1)}% des participants
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-b-[7px] border-primary hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
              <ClockIcon className="h-6 w-6 text-purple-700 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dernier Inscrit</p>
              <h3 className="text-base font-medium">
                {mostRecentParticipant?.user.prenom} {mostRecentParticipant?.user.nom}
                <br />
                <span className="text-sm text-muted-foreground">
                  {mostRecentParticipant?.entreprise}
                </span>
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}