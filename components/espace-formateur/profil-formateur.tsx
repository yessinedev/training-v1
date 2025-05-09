"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Formateur } from "@/types"

interface ProfilFormateurProps {
  formateur: Formateur
}

export function ProfilFormateur({ formateur }: ProfilFormateurProps) {
  const [nom, setNom] = useState(formateur.user.nom)
  const [prenom, setPrenom] = useState(formateur.user.prenom)
  const [email, setEmail] = useState(formateur.user.email)
  const [telephone, setTelephone] = useState(formateur.user.telephone)
  const [tarifHeure, setTarifHeure] = useState(formateur.tarif_heure?.toString() || "")
  const [tarifJour, setTarifJour] = useState(formateur.tarif_jour?.toString() || "")
  const [tarifSeance, setTarifSeance] = useState(formateur.tarif_seance?.toString() || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simuler la mise à jour du profil
    console.log("Profil à mettre à jour:", {
      nom,
      prenom,
      email,
      telephone,
      tarifHeure,
      tarifJour,
      tarifSeance,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/placeholder.svg" alt={formateur.user.nom} />
          <AvatarFallback className="text-xl">
            {formateur.user.prenom.charAt(0)}
            {formateur.user.nom.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium">
            {formateur.user.prenom} {formateur.user.nom}
          </h3>
          <p className="text-sm text-muted-foreground">Formateur</p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="prenom">Prénom</Label>
          <Input id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nom">Nom</Label>
          <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telephone">Téléphone</Label>
          <Input id="telephone" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
        </div>
      </div>

      <Separator />

      <h3 className="text-lg font-medium">Informations tarifaires</h3>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="tarif-heure">Tarif horaire (DT)</Label>
          <Input id="tarif-heure" type="number" value={tarifHeure} onChange={(e) => setTarifHeure(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tarif-jour">Tarif journalier (DT)</Label>
          <Input id="tarif-jour" type="number" value={tarifJour} onChange={(e) => setTarifJour(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tarif-seance">Tarif par séance (DT)</Label>
          <Input id="tarif-seance" type="number" value={tarifSeance} onChange={(e) => setTarifSeance(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Enregistrer les modifications</Button>
      </div>
    </form>
  )
}
