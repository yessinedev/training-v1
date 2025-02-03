'use client';

import { useState } from "react";
import { format } from "date-fns";
import {
  Plus,
  Pencil,
  Trash2,
  FolderTree,
  BookOpen,
  Users,
  Calendar,
  MapPin,
  ArrowRight,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  domaines,
  themes,
  actions,
  formateurs,
  users,
} from "@/lib/mock-data";

export default function FormationsPage() {
  const [isDomaineOpen, setIsDomaineOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Training Catalog</h2>
      </div>

      <Tabs defaultValue="catalog" className="space-y-4">
        <TabsList>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="domains">Domains & Themes</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isActionOpen} onOpenChange={setIsActionOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Training
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Training</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formation">Formation</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="seminar">Seminar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {themes.map((theme) => (
                          <SelectItem
                            key={theme.theme_id}
                            value={theme.theme_id.toString()}
                          >
                            {theme.libelle_theme}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input type="date" id="startDate" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input type="date" id="endDate" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="duration_days">Duration (Days)</Label>
                      <Input type="number" id="duration_days" min="1" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="duration_hours">Duration (Hours)</Label>
                      <Input type="number" id="duration_hours" min="1" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="max_participants">Max Participants</Label>
                    <Input type="number" id="max_participants" min="1" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="trainer">Trainer</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trainer" />
                      </SelectTrigger>
                      <SelectContent>
                        {formateurs.map((formateur) => {
                          const user = users.find(
                            (u) => u.user_id === formateur.user_id
                          );
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
                  <Button variant="outline" onClick={() => setIsActionOpen(false)}>
                    Cancel
                  </Button>
                  <Button>Save</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6">
            {domaines.map((domaine) => {
              const domaineThemes = themes.filter(
                (t) => t.domaine_id === domaine.domaine_id
              );

              return (
                <Card key={domaine.domaine_id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderTree className="h-5 w-5" />
                      {domaine.libelle_domaine}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    {domaineThemes.map((theme) => {
                      const themeActions = actions.filter(
                        (a) => a.theme_id === theme.theme_id
                      );

                      return (
                        <div key={theme.theme_id} className="space-y-4">
                          <h4 className="flex items-center gap-2 font-semibold">
                            <BookOpen className="h-4 w-4" />
                            {theme.libelle_theme}
                          </h4>
                          <div className="rounded-lg border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Duration</TableHead>
                                  <TableHead>Location</TableHead>
                                  <TableHead>Participants</TableHead>
                                  <TableHead>Trainer</TableHead>
                                  <TableHead className="text-right">
                                    Actions
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {themeActions.map((action) => {
                                  return (
                                    <TableRow key={action.action_id}>
                                      <TableCell>
                                        <Badge variant="outline">
                                          {action.type_action}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-2">
                                          <Calendar className="h-4 w-4" />
                                          {format(
                                            new Date(action.date_debut!),
                                            "dd/MM/yyyy"
                                          )}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        {action.duree_jours} days (
                                        {action.duree_heures}h)
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-2">
                                          <MapPin className="h-4 w-4" />
                                          {action.lieu}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-2">
                                          <Users className="h-4 w-4" />
                                          {action.nb_participants_prevu}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        {formateurs.map((formateur) => {
                                          const user = users.find(
                                            (u) =>
                                              u.user_id === formateur.user_id
                                          );
                                          return (
                                            <span
                                              key={formateur.formateur_id}
                                            >{`${user?.prenom} ${user?.nom}`}</span>
                                          );
                                        })}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <TooltipProvider>
                                          <div className="flex items-center justify-end gap-2">
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-8 w-8"
                                                  asChild
                                                >
                                                  <Link href={`/dashboard/formations/${action.action_id}`}>
                                                    <ArrowRight className="h-4 w-4" />
                                                    <span className="sr-only">Manage session</span>
                                                  </Link>
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Manage session</p>
                                              </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-8 w-8"
                                                >
                                                  <Pencil className="h-4 w-4" />
                                                  <span className="sr-only">Edit training</span>
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Edit training</p>
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
                                                  <span className="sr-only">Delete training</span>
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Delete training</p>
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
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="domains" className="space-y-4">
          <div className="flex justify-end gap-2">
            <Dialog open={isThemeOpen} onOpenChange={setIsThemeOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Theme
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Theme</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="theme_name">Theme Name</Label>
                    <Input id="theme_name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                      <SelectContent>
                        {domaines.map((domaine) => (
                          <SelectItem
                            key={domaine.domaine_id}
                            value={domaine.domaine_id.toString()}
                          >
                            {domaine.libelle_domaine}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setIsThemeOpen(false)}>
                    Cancel
                  </Button>
                  <Button>Save</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isDomaineOpen} onOpenChange={setIsDomaineOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Domain
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Domain</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="domain_name">Domain Name</Label>
                    <Input id="domain_name" />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setIsDomaineOpen(false)}>
                    Cancel
                  </Button>
                  <Button>Save</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Themes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domaines.map((domaine) => {
                  const domaineThemes = themes.filter(
                    (t) => t.domaine_id === domaine.domaine_id
                  );

                  return (
                    <TableRow key={domaine.domaine_id}>
                      <TableCell className="font-medium">
                        {domaine.libelle_domaine}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {domaineThemes.map((theme) => (
                            <Badge
                              key={theme.theme_id}
                              variant="secondary"
                              className="flex items-center gap-2"
                            >
                              {theme.libelle_theme}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 text-muted-foreground hover:text-foreground"
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <div className="flex items-center justify-end gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit domain</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit domain</p>
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
                                  <span className="sr-only">Delete domain</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete domain</p>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}