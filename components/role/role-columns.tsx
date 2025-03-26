import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Edit, Trash } from "lucide-react";
import { createActionColumn, createGenericColumns } from "../dt/columns";
import { Role } from "@/types";

export const getRolesColumns = (
  handleEdit: (role: Role) => void,
  handleDelete: (roleId: number) => void
): ColumnDef<Role>[] => [
  ...createGenericColumns<Role>([
    {
      accessorKey: "role_name",
      headerLabel: "Nom du rôle",
      isSortable: true,
    },
    {
      accessorKey: "users",
      headerLabel: "Nombre d'utilisateurs",
      cellRenderer: (role: Role) => (
        <Badge variant="secondary">{role.users.length}</Badge>
      ),
    },
  ]),
  createActionColumn<Role>([
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (data) => handleEdit(data),
      variant: "outline",
    },
    {
      label: "Delete",
      icon: <Trash className="h-4 w-4" />,
      onClick: (data) => handleDelete(data.role_id),
      variant: "destructive",
    },
  ]),
];