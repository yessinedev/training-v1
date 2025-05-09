'use client'
import { ProfilFormateur } from "@/components/espace-formateur/profil-formateur"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFormateur } from "@/hooks/useFormateur"

export default function ProfilPage() {
  const {formateur, isLoading} = useFormateur();

  if(isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du formateur</CardTitle>
          <CardDescription>Vos informations personnelles et professionnelles</CardDescription>
        </CardHeader>
        <CardContent>
          {formateur && <ProfilFormateur formateur={formateur} />}
        </CardContent>
      </Card>
    </div>
  )
}
