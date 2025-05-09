"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { FileType } from "@/lib/types"
import { getMockFichiers } from "@/lib/mock-data"
import { Calendar, Download, FileText } from "lucide-react"

interface FichiersListProps {
  type: FileType | "FORMATION"
}

export function FichiersList({ type }: FichiersListProps) {
  const files = getMockFichiers().filter((file) =>
    type === "FORMATION" ? file.action_id !== null : file.type === type,
  )

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom du fichier</TableHead>
            <TableHead>Date d'ajout</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Aucun fichier disponible
              </TableCell>
            </TableRow>
          ) : (
            files.map((file) => {
              const fileName = file.file_path.split("/").pop() || file.title || "Fichier"

              return (
                <TableRow key={file.file_id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{file.title || fileName}</span>
                    </div>
                    {file.action_id && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Formation: {file.action?.theme.libelle_theme}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>
                        {file.validated_at ? new Date(file.validated_at).toLocaleDateString("fr-FR") : "Non définie"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={file.validated ? "default" : "outline"}>
                      {file.validated ? "Validé" : "En attente"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
