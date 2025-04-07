import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Edit, Eye, Trash } from "lucide-react";
import { createActionColumn, createGenericColumns } from "../dt/columns";
import { Formateur, User } from "@/types";
import { Checkbox } from "../ui/checkbox";

export const getFormateurColumns = (
  handleDelete: (userId: string) => void,
  handleEdit?: (participant: Formateur) => void
): ColumnDef<Formateur>[] => [
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
  ...createGenericColumns<Formateur>([
    {
      accessorKey: "nom",
      headerLabel: "Nom",
      isSortable: true,
      accessorFn: (row) => row.user.nom,
      cellRenderer: (row) => row.user.nom,
    },
    {
      accessorKey: "prenom",
      headerLabel: "Prenom",
      isSortable: true,
      accessorFn: (row) => row.user.prenom,
      cellRenderer: (row) => row.user.prenom,
    },
    {
      accessorKey: "email",
      headerLabel: "Email",
      accessorFn: (row) => row.user.email,
      cellRenderer: (row) => row.user.email,
    },
    {
      accessorKey: "telephone",
      headerLabel: "Telephone",
      accessorFn: (row) => row.user.telephone,
      cellRenderer: (row) => row.user.telephone,
    },
  ]),
  createActionColumn<Formateur>([
    {
      label: "Profile",
      icon: <Eye className="h-4 w-4" />,
      onClick: (data) => handleEdit && handleEdit(data),
      variant: "default",
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (data) => handleEdit && handleEdit(data),
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
