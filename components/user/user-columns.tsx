import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Edit, Trash } from "lucide-react";
import { createActionColumn, createGenericColumns } from "../dt/columns";
import { Role, User } from "@/types";
import { Checkbox } from "../ui/checkbox";

export const getUserColumns = (
  handleEdit: (user: User) => void,
  handleDelete: (userId: string) => void
): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  ...createGenericColumns<User>([
    {
      accessorKey: "nom",
      headerLabel: "Nom",
      isSortable: true,
    },
    {
      accessorKey: "prenom",
      headerLabel: "Prenom",
      isSortable: true,
    },
    {
      accessorKey: "email",
      headerLabel: "Email",
    },
    {
      accessorKey: "telephone",
      headerLabel: "Telephone",
    },
    {
      accessorKey: "role",
      headerLabel: "Role",
      cellRenderer: (user: User) => (
        <Badge variant={"secondary"}>{user.role.role_name}</Badge>
      ),
    },
    {
      accessorKey: "statut",
      headerLabel: "Statut",
      cellRenderer: (user: User) => (
        <Badge
          className={`${
            user.user_id.startsWith("inv") ? "bg-violet-500" : "bg-green-500"
          }`}
        >
          {user.user_id.startsWith("inv") ? "Invité" : "Vérifié"}
        </Badge>
      ),
    },
  ]),
  createActionColumn<User>([
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (data) => handleEdit(data),
      variant: "outline",
    },
    {
      label: "Delete",
      icon: <Trash className="h-4 w-4" />,
      onClick: (data) => handleDelete(data.user_id),
      variant: "destructive",
    },
  ]),
];
