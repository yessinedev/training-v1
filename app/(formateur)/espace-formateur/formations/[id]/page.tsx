'use client'
import { FormationDetails } from "@/components/espace-formateur/formation-details"
import { SessionsFormation } from "@/components/espace-formateur/sessions-formation"
import { ParticipantsFormation } from "@/components/espace-formateur/participants-formation"
import { FichiersFormation } from "@/components/espace-formateur/fichiers-formation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { fetchFormationById } from "@/services/formationService"
import { use } from "react"

export default function FormationPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = use(params)
  
  const { data: formation, isLoading: isLoadingFormation } = useQuery({
    queryKey: ["formation", id],
    queryFn: () => fetchFormationById(parseInt(id)),
    enabled: !!id,
  });

  if (isLoadingFormation) {
    return <div>Chargement...</div>
  }

  if (!formation) {
    return <div>Formation non trouvée</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/espace-formateur/formations">
            <ChevronLeft className="h-4 w-4" />
            Retour
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{formation.theme.libelle_theme}</h1>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="fichiers">Fichiers</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <FormationDetails formation={formation} />
        </TabsContent>

        <TabsContent value="sessions">
          <SessionsFormation formation={formation} />
        </TabsContent>

        <TabsContent value="participants">
          <ParticipantsFormation formation={formation} />
        </TabsContent>

        <TabsContent value="fichiers">
          <FichiersFormation formation={formation} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
