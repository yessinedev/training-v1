"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FileType } from "@/lib/types"
import { getMockFormationsFormateur } from "@/lib/mock-data"
import { Upload } from "lucide-react"

interface FileUploaderProps {
  type: FileType | "FORMATION"
  withFormationSelect?: boolean
  actionId?: number
}

export function FileUploader({ type, withFormationSelect = false, actionId }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [selectedFormation, setSelectedFormation] = useState<string>(actionId ? actionId.toString() : "")

  const formations = getMockFormationsFormateur()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      if (!title) {
        setTitle(e.target.files[0].name)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simuler l'envoi du fichier
    console.log("Fichier à envoyer:", {
      file,
      title,
      type,
      formationId: selectedFormation,
    })

    // Réinitialiser le formulaire
    setFile(null)
    setTitle("")
    if (!actionId) {
      setSelectedFormation("")
    }

    // Réinitialiser l'input file
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  let typeLabel = ""
  switch (type) {
    case "CV":
      typeLabel = "CV"
      break
    case "BADGE":
      typeLabel = "Badge"
      break
    case "FEUILLE_EMARGEMENT":
      typeLabel = "Feuille d'émargement"
      break
    case "FORMATION":
      typeLabel = "Matériel de formation"
      break
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload">Télécharger un {typeLabel}</Label>
        <Input id="file-upload" type="file" onChange={handleFileChange} className="cursor-pointer" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-title">Titre du document</Label>
        <Input
          id="file-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entrez un titre pour ce document"
        />
      </div>

      {withFormationSelect && (
        <div className="space-y-2">
          <Label htmlFor="formation-select">Formation associée</Label>
          <Select value={selectedFormation} onValueChange={setSelectedFormation} disabled={!!actionId}>
            <SelectTrigger id="formation-select">
              <SelectValue placeholder="Sélectionner une formation" />
            </SelectTrigger>
            <SelectContent>
              {formations.map((formation) => (
                <SelectItem key={formation.action_id} value={formation.action_id.toString()}>
                  {formation.theme.libelle_theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button
        type="submit"
        disabled={!file || !title || (withFormationSelect && !selectedFormation && !actionId)}
        className="w-full"
      >
        <Upload className="mr-2 h-4 w-4" />
        Télécharger
      </Button>
    </form>
  )
}
