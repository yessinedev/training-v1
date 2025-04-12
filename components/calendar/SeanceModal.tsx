'use client';

import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Formation, Seance, SeanceStatut } from "@/types";
import { getDatesBetween } from "@/lib/utils";

interface SessionModalProps {
  session: Seance;
  formation: Formation | null;
  mode: "create" | "edit";
  onSave: (session: Seance) => void;
  onDelete: (sessionId: string) => void;
  onClose: () => void;
}

export function SeanceModal({
  session,
  formation,
  mode,
  onSave,
  onDelete,
  onClose,
}: SessionModalProps) {
  const [formData, setFormData] = useState<Seance>(session);

  // Handle form submission.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nouvelle session" : "Modifier la session"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Statut Selection */}
          <div className="space-y-2">
            <Label htmlFor="statut">Type</Label>
            <Select
              value={formData.statut as unknown as string}
              onValueChange={(value) =>
                setFormData({ ...formData, statut: value as unknown as SeanceStatut })
              }
            >
              <SelectTrigger id="statut">
                <SelectValue placeholder="Sélectionnez le statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EN_ATTENTE">EN_ATTENTE</SelectItem>
                <SelectItem value="EN_COURS">EN_COURS</SelectItem>
                <SelectItem value="TERMINEE">TERMINEE</SelectItem>
                <SelectItem value="ANNULEE">ANNULEE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date and Hour Selections */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date Selector */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Select
                value={
                  formData.date
                    ? new Date(formData.date).toISOString()
                    : ""
                }
                onValueChange={(val) =>
                  setFormData({ ...formData, date: new Date(val) })
                }
              >
                <SelectTrigger id="date" className="w-full">
                  <SelectValue placeholder="Sélectionnez une date" />
                </SelectTrigger>
                <SelectContent>
                  {formation &&
                    getDatesBetween(
                      new Date(formation.date_debut),
                      new Date(formation.date_fin)
                    ).map((date) => (
                      <SelectItem
                        key={date.toISOString()}
                        value={date.toISOString()}
                      >
                        {format(date, "dd/MM/yyyy")}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Heure Debut Selector */}
            <div className="space-y-2">
              <Label htmlFor="heure">Heure Début</Label>
              <Select
                value={formData.heure || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, heure: value })
                }
              >
                <SelectTrigger id="heure" className="w-full">
                  <SelectValue placeholder="Sélectionnez une heure" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 8).map(
                    (hour) => (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Durée Input */}
          <div className="space-y-2">
            <Label htmlFor="duree">Durée (heures)</Label>
            <Input
              id="duree"
              type="number"
              min={1}
              max={8}
              value={String(formData.duree_heures)}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duree_heures: Number(e.target.value),
                })
              }
              className="w-full"
            />
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            {mode === "edit" && (
              <Button
                type="button"
                variant="destructive"
                onClick={() =>
                  onDelete(formData.seance_id.toString())
                }
              >
                Supprimer
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {mode === "create" ? "Créer" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
