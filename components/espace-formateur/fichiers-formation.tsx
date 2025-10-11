"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, FileText, Upload } from "lucide-react"
import { FileUploader } from "./file-uploader"
import { FileType, Formation } from "@/types"

interface FichiersFormationProps {
  formation: Formation
}

export function FichiersFormation({ formation }: FichiersFormationProps) {
  const files = formation.files

  return (
    <div className="space-y-6">
      <div className="rounded-md border bg-muted/50 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Ajouter un fichier</h3>
        </div>
        <FileUploader type={FileType.FORMATION} actionId={formation.action_id} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du fichier</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>{"Date d'ajout"}</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files && files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Aucun fichier disponible
                </TableCell>
              </TableRow>
            ) : (
              files && files.map((file) => {
                const fileName = file.file_path.split("/").pop() || file.title || "Fichier"

                return (
                  <TableRow key={file.file_id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{file.title || fileName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{file.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>
                          {/* {file.validated_at ? new Date(file.validated_at).toLocaleDateString("fr-FR") : "Non définie"} */}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {/* <Badge variant={file.validated ? "default" : "outline"}>
                        {file.validated ? "Validé" : "En attente"}
                      </Badge> */}
                      <Badge variant="default">
                        Validé
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
    </div>
  )
}
