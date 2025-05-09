'use client'
import { SessionsCalendar } from "@/components/espace-formateur/sessions-calendar"
import { SessionsTable } from "@/components/espace-formateur/sessions-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFormateur } from "@/hooks/useFormateur"
import { CalendarIcon, ListIcon } from "lucide-react"

export default function SessionsPage() {
  const {formateur} = useFormateur()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
      </div>

      <Tabs defaultValue="liste" className="space-y-4">
        <TabsList>
          <TabsTrigger value="liste" className="flex items-center gap-2">
            <ListIcon className="h-4 w-4" />
            Liste
          </TabsTrigger>
          <TabsTrigger value="calendrier" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendrier
          </TabsTrigger>
        </TabsList>

        <TabsContent value="liste">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les sessions</CardTitle>
              <CardDescription>Liste de toutes vos sessions programmées</CardDescription>
            </CardHeader>
            <CardContent>
              {formateur && <SessionsTable formateurId={formateur?.user_id} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendrier">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des sessions</CardTitle>
              <CardDescription>Vue calendrier de vos sessions</CardDescription>
            </CardHeader>
            <CardContent>
             { formateur && <SessionsCalendar formateurId={formateur?.user_id} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
