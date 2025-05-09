"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormationsEnCours } from "@/components/espace-formateur/formations-en-cours";
import { SessionsAVenir } from "@/components/espace-formateur/sessions-a-venir";
import { StatistiquesFormateur } from "@/components/espace-formateur/statistiques-formateur";
import { useFormateur } from "@/hooks/useFormateur";

export default function FormateurDashboard() {
  const { isLoading, formateur,  } = useFormateur();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue dans votre espace formateur
        </p>
      </div>

      <Tabs defaultValue="apercu" className="space-y-4">
        <TabsList>
          <TabsTrigger value="apercu">Aperçu</TabsTrigger>
          <TabsTrigger value="formations">Formations</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="apercu" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatistiquesFormateur formateurId={formateur?.user_id ?? ''} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Formations en cours</CardTitle>
                <CardDescription>
                  Vos formations actuellement en cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormationsEnCours limit={3} formateurId={formateur?.user_id ?? ''} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sessions à venir</CardTitle>
                <CardDescription>
                  Vos prochaines sessions programmées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SessionsAVenir formateurId={formateur?.user_id ?? ''} limit={3} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="formations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Toutes vos formations</CardTitle>
              <CardDescription>
                Liste complète des formations que vous animez
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormationsEnCours formateurId={formateur?.user_id ?? ''} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des sessions</CardTitle>
              <CardDescription>Toutes vos sessions programmées</CardDescription>
            </CardHeader>
            <CardContent>
              <SessionsAVenir formateurId={formateur?.user_id ?? ''} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
