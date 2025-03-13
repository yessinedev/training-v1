"use client"

import { User } from "@/types"
import { ColumnDef } from "@tanstack/react-table"



export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "nom",
    header: "Nom",
  },
  {
    accessorKey: "prenom",
    header: "Prenom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "telephone",
    header: "Telephone",
  },
]
