"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddUsersModal from "./AddUsersModal";
import { User } from "@/types";
import { deleteUser, fetchUsers } from "@/services/userService";
import { getUserColumns } from "./user-columns";
import { DataTable } from "../dt/data-table";
import EditUserModal, { EditableUser } from "./EditUserModal";
import { toast } from "sonner";

const UsersTable = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["users"], queryFn: () => fetchUsers() });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Un erreur est survenu";
      toast.error(errorMessage);

    },
  });

  const handleDeleteUser = useCallback(
    async (userId: string) => {
      if (window.confirm("Are you sure you want to delete this user?")) {
        try {
          await deleteUserMutation.mutateAsync(userId);
        } catch (error) {
          console.error("Delete submission error:", error);
        }
      }
    },
    [deleteUserMutation]
  );

  const handleOpenDialog = useCallback(
    (user?: User) => {
      setSelectedUser(user ?? null);
      setIsDialogOpen(true);
    },
    [setSelectedUser, setIsDialogOpen]
  );

  const columns = useMemo(
    () => getUserColumns((user) => handleOpenDialog(user), handleDeleteUser),
    [handleOpenDialog, handleDeleteUser]
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching users</p>;

  return (
    <div className="">
      <AddUsersModal />

      <DataTable data={users} columns={columns} searchColumn="email" />
      {isDialogOpen && selectedUser && (
        <EditUserModal
          user={selectedUser as unknown as EditableUser}
          isOpen={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UsersTable;
