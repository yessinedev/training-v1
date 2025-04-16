"use client";
import React, { useCallback, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import UserForm from "./AddUserForm";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { useAuthMutation } from "@/hooks/useAuthMutation";
import { User } from "@/types";
import { deleteUser, fetchUsers } from "@/services/userService";
import { getUserColumns } from "./user-columns";
import { DataTable } from "../dt/data-table";

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
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error deleting user:", errorMessage);
    },
  });

  const handleDeleteUser = useCallback(async (userId: string) => {
      if (window.confirm("Are you sure you want to delete this user?")) {
        try {
          await deleteUserMutation.mutateAsync(userId);
        } catch (error) {
          console.error("Delete submission error:", error);
        }
      }
    }, [deleteUserMutation]);

  const columns = useMemo(
    () => getUserColumns((user) => handleOpenDialog(user), handleDeleteUser),
    [handleDeleteUser]
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching users</p>;

  return (
    <div className="">
      <Button onClick={() => handleOpenDialog()}>
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un utilisateur
      </Button>
      <DataTable data={users} columns={columns} searchColumn="email" />
      {isDialogOpen && (
        <UserForm
          user={selectedUser || undefined}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </div>
  );
};

export default UsersTable;
