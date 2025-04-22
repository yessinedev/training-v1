"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import UserForm, { UserFormValues } from "./UserForm";

export interface EditableUser extends UserFormValues {
  user_id: string;
}

interface EditUserModalProps {
  user: EditableUser;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditUserModal({ user, isOpen, onOpenChange }: EditUserModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Mettre à jour les informations de l'utilisateur.
          </DialogDescription>
        </DialogHeader>
        <UserForm initialValues={user} />
      </DialogContent>
    </Dialog>
  );
}
