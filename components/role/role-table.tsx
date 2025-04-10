"use client";
import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Role } from "@/types";
import axiosInstance from "@/lib/axios";
import RoleForm from "../user/AddRoleForm";
import { useAuth } from "@clerk/nextjs";
import { DataTable } from "../dt/data-table";
import { getRolesColumns } from "./role-columns";

const RolesTable = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { getToken } = useAuth();

  const queryClient = useQueryClient();

  const handleOpenDialog = (role?: Role) => {
    console.log("selectedRole");
    setSelectedRole(role ?? null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedRole(null);
    setIsDialogOpen(false);
  };

  const {
    data: roles,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const token = await getToken({ template: "my-jwt-template" });
      const response = await axiosInstance.get("/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (roleId: number) => {
      const token = await getToken({ template: "my-jwt-template" });
      await axiosInstance.delete(`/roles?id=${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  const handleDeleteRole = (roleId: number) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      deleteRoleMutation.mutate(roleId);
    }
  };

  const columns = useMemo(
    () => getRolesColumns((role) => handleOpenDialog(role), handleDeleteRole),
    []
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching roles</p>;

  return (
    <>
      <Button onClick={() => handleOpenDialog()}>
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un Role
      </Button>

      <RoleForm
        role={selectedRole || undefined}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onOpenChange={setIsDialogOpen}
      />

      <DataTable columns={columns} data={roles} searchColumn="role_name" />
    </>
  );
};

export default RolesTable;
