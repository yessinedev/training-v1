"use client";
import { SessionDetails } from "@/components/espace-formateur/session-details";
import { PresenceList } from "@/components/espace-formateur/presence-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Seance } from "@/types";
import { fetchSeanceById } from "@/services/seanceService";

export default function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session, isLoading: isLoadingFormation } = useQuery<Seance>({
    queryKey: ["seances-formateur", id],
    queryFn: () => fetchSeanceById(parseInt(id)),
    enabled: !!id,
  });

  if (isLoadingFormation) {
    return <div>Chargement...</div>;
  }
  if (!session) {
    return <div>Session non trouvée</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/espae-formateur/sessions">
            <ChevronLeft className="h-4 w-4" />
            Retour
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Session du{" "}
          {session.date
            ? new Date(session.date).toLocaleDateString("fr-FR")
            : "Non programmée"}
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Détails de la session</CardTitle>
            <CardDescription>Informations sur cette session</CardDescription>
          </CardHeader>
          <CardContent>
            <SessionDetails session={session} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Gestion des présences</CardTitle>
              <CardDescription>
                Marquer les présences des participants
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <PresenceList
              formationId={session.action_id}
              sessionId={session.seance_id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
