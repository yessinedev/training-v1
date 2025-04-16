"use client";

import { useState } from "react";
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
import TimePicker from "./TimePicker";

interface SessionModalProps {
  seance: Seance;
  formation: Formation | null;
  mode: "create" | "edit";
  onSave: (session: Seance) => void;
  onDelete: (sessionId: string) => void;
  onClose: () => void;
}

export function SeanceModal({
  seance,
  formation,
  mode,
  onSave,
  onDelete,
  onClose,
}: SessionModalProps) {
  const [formData, setFormData] = useState<Seance>(seance);
  const [selectedTime, setSelectedTime] = useState(seance.heure || "08:00");

console.log(formData)
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
              defaultValue={formData.statut as unknown as string}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  statut: value as unknown as SeanceStatut,
                })
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
            {/* Date Input */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                min={
                  formation
                    ? new Date(formation.date_debut).toISOString().split("T")[0]
                    : ""
                }
                max={
                  formation
                    ? new Date(formation.date_fin).toISOString().split("T")[0]
                    : ""
                }
                value={
                  mode === "create"
                    ? formData.date
                      ? formData.date.toISOString().split("T")[0]
                      : ""
                    : new Date(formData.date).toISOString().split("T")[0]
                }
                onChange={(e) =>
                  setFormData({ ...formData, date: new Date(e.target.value) })
                }
                className="w-full"
              />
            </div>

            {/* Time Input */}
            <div className="space-y-2">
              <Label htmlFor="heure">Heure Début</Label>
              <TimePicker value={selectedTime} onChange={setSelectedTime} />
            </div>
          </div>

          {/* Durée Input */}
          <div className="space-y-2">
            <Label htmlFor="duree">Durée (heures)</Label>
            <Input
              id="duree"
              type="string"
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
                onClick={() => onDelete(formData.seance_id.toString())}
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
