"use client";
import React, { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import UserForm from "./AddUserForm";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { useAuthMutation } from "@/hooks/useAuthMutation";
import { User } from "@/types";
import { deleteUser, fetchUsers } from "@/services/userService";
import { DataTable } from "../data-table/data-table";
import { columns } from "../data-table/columns";

const UsersTable = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleOpenDialog = (user?: User) => {
    setSelectedUser(user ?? null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setIsDialogOpen(false);
  };

  const {
    data: users,
    isLoading,
    isError,
  } = useAuthQuery(["users"], fetchUsers);

  const deleteUserMutation = useAuthMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to delete user: ${errorMessage}`);
      console.error("Error deleting user:", error);
    },
  });

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserMutation.mutateAsync(userId);
      } catch (error) {
        console.error("Delete submission error:", error);
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching users</p>;

  return (
    <>
      <Button onClick={() => handleOpenDialog()}>
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un utilisateur
      </Button>
      {isDialogOpen && (
        <UserForm
          user={selectedUser || undefined}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onOpenChange={setIsDialogOpen}
        />
      )}

      <div className="">
        <DataTable data={users} columns={columns} />
      </div>
    </>
  );
};

export default UsersTable;
