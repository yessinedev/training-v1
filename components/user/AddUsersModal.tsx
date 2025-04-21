"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import UserForm from "./UserForm";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import FormateurForm from "../formateurs/formateur-form";

const AddUsersModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
          <DialogDescription>
            Remplissez les informations de l'utilisateur.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="utilisateur" className="w-full">
          <TabsList>
            <TabsTrigger value="utilisateur">Utilisateur</TabsTrigger>
            <TabsTrigger value="formateur">Formateur</TabsTrigger>
            <TabsTrigger value="participant">Participant</TabsTrigger>
          </TabsList>
          <TabsContent value="utilisateur">
            <UserForm />
          </TabsContent>
          <TabsContent value="formateur">
            <FormateurForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddUsersModal;
