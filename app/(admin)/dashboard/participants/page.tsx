'use client';

import { useState } from "react";
import { format } from "date-fns";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Download,
  FileSpreadsheet,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import {
  participants,
  actions,
  actionFormationParticipants,
  attestations,
} from "@/lib/mock-data";

export default function ParticipantsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Participants</h2>
        <div className="flex gap-2">
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Participants</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="file">Excel File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload an Excel or CSV file containing participant information
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" asChild className="w-full">
                    <a href="#" download>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Download Template
                    </a>
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setIsImportOpen(false)}>
                  Cancel
                </Button>
                <Button>Import</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Participant
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Participant</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input id="nom" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input id="prenom" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" type="tel" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="entreprise">Entreprise</Label>
                  <Input id="entreprise" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="poste">Poste</Label>
                  <Input id="poste" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="action">Formation</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select formation" />
                    </SelectTrigger>
                    <SelectContent>
                      {actions.map((action) => (
                        <SelectItem
                          key={action.action_id}
                          value={action.action_id.toString()}
                        >
                          {action.type_action} - {action.lieu} (
                          {format(new Date(action.date_debut), 'dd/MM/yyyy')})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Formations</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((participant) => {
              const participantActions = actionFormationParticipants.filter(
                (ap) => ap.participant_id === participant.participant_id
              );
              const participantAttestations = attestations.filter(
                (att) => att.participant_id === participant.participant_id
              );

              return (
                <TableRow key={participant.participant_id}>
                  <TableCell>{participant.participant_id}</TableCell>
                  <TableCell>{participant.nom}</TableCell>
                  <TableCell>{participant.prenom}</TableCell>
                  <TableCell>{participant.email}</TableCell>
                  <TableCell>{participant.entreprise}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {participantActions.map((pa) => {
                        const action = actions.find(
                          (a) => a.action_id === pa.action_id
                        );
                        const attestation = participantAttestations.find(
                          (att) => att.action_id === pa.action_id
                        );

                        return (
                          <TooltipProvider key={`${pa.action_id}-${pa.participant_id}`}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1">
                                  <span className="text-sm">
                                    {action?.type_action}
                                  </span>
                                  {attestation && (
                                    <Award className="h-4 w-4 text-green-500" />
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {action?.type_action} - {action?.lieu}
                                  <br />
                                  {format(new Date(action?.date_debut!), 'dd/MM/yyyy')}
                                  <br />
                                  Status: {pa.statut}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit participant</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit participant</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete participant</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete participant</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}