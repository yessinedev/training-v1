"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Participant, PresenceStatus, Seance } from "@/types";
import {
  BuildingIcon,
  BriefcaseIcon,
  CalendarIcon,
  GraduationCapIcon,
  ClockIcon,
  FileIcon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { SeanceStatut } from "@prisma/client";

type ParticipantProfileProps = {
  participant: Participant;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

function PresenceStatusBadge({ status }: { status: PresenceStatus }) {
  const variants: Record<
    PresenceStatus,
    "default" | "destructive" | "secondary"
  > = {
    PRESENT: "default",
    ABSENT: "destructive",
    RETARD: "secondary",
  };

  return <Badge variant={variants[status]}>{status}</Badge>;
}

function ActionStatusBadge({ status }: { status: SeanceStatut }) {
  const variants: Record<
    SeanceStatut,
    "default" | "destructive" | "secondary" | "outline"
  > = {
    EN_ATTENTE: "default",
    EN_COURS: "secondary",
    TERMINEE: "outline",
    ANNULEE: "destructive",
  };

  return <Badge variant={variants[status]}>{status}</Badge>;
}

const ParticipantProfile = ({
  participant,
  isOpen,
  onOpenChange,
}: ParticipantProfileProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Profil du participant</DialogTitle>
        </DialogHeader>

        {participant && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {participant.user.prenom[0]}
                  {participant.user.nom[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-bold">
                  {participant.user.prenom} {participant.user.nom}
                </h3>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BuildingIcon className="h-4 w-4" />
                    {participant.entreprise}
                  </span>
                  <span className="flex items-center gap-1">
                    <BriefcaseIcon className="h-4 w-4" />
                    {participant.poste}
                  </span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="formations" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="formations">Formations</TabsTrigger>
                <TabsTrigger value="presence">Présences</TabsTrigger>
                <TabsTrigger value="certificates">Certificats</TabsTrigger>
              </TabsList>

              <TabsContent value="formations" className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <GraduationCapIcon className="h-5 w-5" />
                  Formations
                </h4>
                <div className="space-y-3">
                  {participant.actions?.map((action) => (
                    <div
                      key={action.action_id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">
                          {action?.action?.theme?.libelle_theme}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(
                            action.action.date_debut
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            action.action.date_fin
                          ).toLocaleDateString()}
                        </div>
                      </div>
                      {/* <ActionStatusBadge status={action.action.} /> */}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="presence" className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  Présences
                </h4>
                <div className="space-y-3">
                  {participant.presences?.map((presence) => (
                    <div
                      key={presence.presence_id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        <span>
                          {new Date(presence.noted_at).toLocaleDateString()}
                        </span>
                      </div>
                      <PresenceStatusBadge status={presence.status} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="certificates" className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <FileIcon className="h-5 w-5" />
                  Certificats
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {participant.attestations?.map((certificate) => (
                    <div
                      key={certificate.attestation_id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">
                          {certificate.action?.theme?.libelle_theme}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(
                            certificate.date_emission!
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantProfile;
