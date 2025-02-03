'use client';

import { useState } from "react";
import { format } from "date-fns";
import {
  Users,
  Calendar,
  MapPin,
  Clock,
  GraduationCap,
  UserPlus,
  Award,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Link from "next/link";
import {
  actions,
  themes,
  formateurs,
  users,
  participants,
  actionFormationParticipants,
  attestations,
} from "@/lib/mock-data";
import { useParams } from 'next/navigation'



export default function TrainingSessionPage() {
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [isAddTrainerOpen, setIsAddTrainerOpen] = useState(false);
  const [isGenerateAttestationOpen, setIsGenerateAttestationOpen] = useState(false);
  const params = useParams();

  const action = actions.find((a) => a.action_id === parseInt(params.id as string));
  const theme = themes.find((t) => t.theme_id === action?.theme_id);
  
  const sessionParticipants = actionFormationParticipants
    .filter((afp) => afp.action_id === parseInt(params.id as string))
    .map((afp) => {
      const participant = participants.find((p) => p.participant_id === afp.participant_id);
      const attestation = attestations.find(
        (att) => att.action_id === afp.action_id && att.participant_id === afp.participant_id
      );
      return { ...afp, participant, attestation };
    });

  if (!action || !theme) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/formations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{action.type_action}</h2>
            <p className="text-muted-foreground">{theme.libelle_theme}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {format(new Date(action.date_debut!), "dd/MM/yyyy")} -{" "}
                {format(new Date(action.date_fin!), "dd/MM/yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {action.duree_jours} days ({action.duree_heures}h)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{action.lieu}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {sessionParticipants.length} / {action.nb_participants_prevu} participants
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" onClick={() => setIsAddParticipantOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Participant
            </Button>
            <Button className="w-full" variant="outline" onClick={() => setIsAddTrainerOpen(true)}>
              <GraduationCap className="mr-2 h-4 w-4" />
              Assign Trainer
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => setIsGenerateAttestationOpen(true)}
            >
              <Award className="mr-2 h-4 w-4" />
              Generate Attestations
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="participants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="trainers">Trainers</TabsTrigger>
        </TabsList>

        <TabsContent value="participants">
          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
              <CardDescription>
                Manage participants and their attestations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Attestation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessionParticipants.map(({ participant, statut, attestation }) => (
                      <TableRow key={participant?.participant_id}>
                        <TableCell>
                          {participant?.prenom} {participant?.nom}
                        </TableCell>
                        <TableCell>{participant?.entreprise}</TableCell>
                        <TableCell>{participant?.poste}</TableCell>
                        <TableCell>
                          <Badge
                            variant={statut === "Confirmé" ? "default" : "secondary"}
                          >
                            {statut}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {attestation ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Issued
                            </Badge>
                          ) : (
                            <Badge variant="outline">Pending</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trainers">
          <Card>
            <CardHeader>
              <CardTitle>Trainers</CardTitle>
              <CardDescription>
                Manage trainers assigned to this session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formateurs.map((formateur) => {
                      const user = users.find((u) => u.user_id === formateur.user_id);
                      return (
                        <TableRow key={formateur.formateur_id}>
                          <TableCell>
                            {user?.prenom} {user?.nom}
                          </TableCell>
                          <TableCell>{user?.email}</TableCell>
                          <TableCell>{user?.telephone}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddParticipantOpen} onOpenChange={setIsAddParticipantOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Participant</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Select Participant</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose participant" />
                </SelectTrigger>
                <SelectContent>
                  {participants
                    .filter(
                      (p) =>
                        !sessionParticipants.some(
                          (sp) => sp.participant?.participant_id === p.participant_id
                        )
                    )
                    .map((participant) => (
                      <SelectItem
                        key={participant.participant_id}
                        value={participant.participant_id.toString()}
                      >
                        {participant.prenom} {participant.nom} - {participant.entreprise}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="waitlist">Waitlist</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsAddParticipantOpen(false)}>
              Cancel
            </Button>
            <Button>Add Participant</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddTrainerOpen} onOpenChange={setIsAddTrainerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Trainer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Select Trainer</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose trainer" />
                </SelectTrigger>
                <SelectContent>
                  {formateurs.map((formateur) => {
                    const user = users.find((u) => u.user_id === formateur.user_id);
                    return (
                      <SelectItem
                        key={formateur.formateur_id}
                        value={formateur.formateur_id.toString()}
                      >
                        {user?.prenom} {user?.nom}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsAddTrainerOpen(false)}>
              Cancel
            </Button>
            <Button>Assign Trainer</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isGenerateAttestationOpen}
        onOpenChange={setIsGenerateAttestationOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Attestations</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Generate attestations for all confirmed participants who have completed
              the training session.
            </p>
            <div className="rounded-lg border p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Summary</p>
                <ul className="text-sm text-muted-foreground">
                  <li>Total participants: {sessionParticipants.length}</li>
                  <li>
                    Pending attestations:{" "}
                    {
                      sessionParticipants.filter(
                        ({ attestation }) => !attestation
                      ).length
                    }
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setIsGenerateAttestationOpen(false)}
            >
              Cancel
            </Button>
            <Button>Generate</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}