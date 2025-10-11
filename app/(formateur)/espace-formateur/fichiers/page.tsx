import { FileUploader } from "@/components/espace-formateur/file-uploader"
import { FichiersList } from "@/components/espace-formateur/fichiers-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileIcon, UserIcon } from "lucide-react"
import { FileType } from "@/types"

export default function FichiersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Mes Fichiers</h1>
      </div>

      <Tabs defaultValue="profil" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profil" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Fichiers de profil
          </TabsTrigger>
          <TabsTrigger value="formations" className="flex items-center gap-2">
            <FileIcon className="h-4 w-4" />
            Matériels de formation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profil">
          <Card>
            <CardHeader>
              <CardTitle>Documents personnels</CardTitle>
              <CardDescription>{"CV, badge et feuilles d'émargement"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUploader type={FileType.CV} />
              <FichiersList type={FileType.CV} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formations">
          <Card>
            <CardHeader>
              <CardTitle>Matériels de formation</CardTitle>
              <CardDescription>Documents et ressources pour vos formations</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader type={FileType.FORMATION} withFormationSelect />
              <FichiersList type={FileType.FORMATION} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
