'use client';

import { format } from "date-fns";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Formation } from "@/types";

type FormationDetailsProps = {
  formation: Formation;
};

export default function FormationDetails({ formation }: FormationDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            {format(new Date(formation.date_debut), "dd/MM/yyyy")} -{" "}
            {format(new Date(formation.date_fin), "dd/MM/yyyy")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {formation.duree_jours} days ({formation.duree_heures}h)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{formation.lieu}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>
            {formation.participants.length} / {formation.nb_participants_prevu} participants
          </span>
        </div>
      </CardContent>
    </Card>
  );
}