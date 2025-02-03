"use client";
import React, { useState } from "react";
import { Trash2, Plus, Pencil } from "lucide-react";
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

import { useQuery } from "@tanstack/react-query";
import { Role, User } from "@/types";
import axiosInstance from "@/lib/axios";
import RoleForm from "../user/AddRoleForm";

const RolesTable = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = (role?: Role) => {
    console.log("selectedRole")
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
      const response = await axiosInstance.get("/roles");
      return response.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching roles</p>;

  return (
    <>
      <Button onClick={() => handleOpenDialog()}>
        <Plus className="mr-2 h-4 w-4" />
        Add Role
      </Button>

      <RoleForm
        role={selectedRole || undefined}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onOpenChange={setIsDialogOpen}
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Users Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles?.map((role: Role) => (
              <TableRow key={role.role_id}>
                <TableCell>{role.role_id}</TableCell>
                <TableCell>{role.role_name}</TableCell>
                <TableCell>
                  {
                    roles.filter((user: User) => user.role_id === role.role_id)
                      .length
                  }
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <div className="flex items-center justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary"
                            onClick={() => handleOpenDialog(role)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit Role</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit role</p>
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
                            <span className="sr-only">Delete role</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete role</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default RolesTable;
