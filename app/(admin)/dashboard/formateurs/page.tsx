'use client';

import { useState } from "react";
import { Plus, Pencil, Trash2, FileText, Badge, Upload } from "lucide-react";
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
import { formateurs, users, roles } from "@/lib/mock-data";

export default function FormateursPage() {
  const [isOpen, setIsOpen] = useState(false);
  const availableUsers = users.filter(
    user => !formateurs.some(f => f.user_id === user.user_id) && 
    user.role_id === roles.find(r => r.role_name === 'Formateur')?.role_id
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Formateurs</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Formateur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Formateur</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="user">Select User</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user) => (
                      <SelectItem key={user.user_id} value={user.user_id.toString()}>
                        {user.prenom} {user.nom} - {user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cv">CV Document</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="cursor-pointer"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="outline">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upload CV</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">
                  Accepted formats: PDF, DOC, DOCX
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="badge">Badge Photo</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="badge"
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="outline">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upload Badge Photo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">
                  Accepted formats: JPG, PNG, GIF
                </p>
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
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formateurs.map((formateur) => {
              const user = users.find(u => u.user_id === formateur.user_id);
              return (
                <TableRow key={formateur.formateur_id}>
                  <TableCell>{formateur.formateur_id}</TableCell>
                  <TableCell>
                    {user?.prenom} {user?.nom}
                  </TableCell>
                  <TableCell>{user?.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {formateur.cv_path && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View CV</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {formateur.badge_path && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Badge className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View Badge</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit formateur</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit formateur</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete formateur</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete formateur</p>
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