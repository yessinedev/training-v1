'use client'
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

export const createGenericColumns = <T extends unknown>(
  columnsConfig: Array<{
    accessorKey: string;
    headerLabel: string;
    isSortable?: boolean;
    cellRenderer?: (row: T) => React.ReactNode;
  }>
): ColumnDef<T>[] => {
  return columnsConfig.map((config) => ({
    accessorKey: config.accessorKey,
    header: ({ column }) => config.isSortable ? (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {config.headerLabel}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ) : config.headerLabel,
    cell: ({ row }) => config.cellRenderer 
      ? config.cellRenderer(row.original)
      : row.getValue(config.accessorKey)
  }));
};

// Create reusable action column
export const createActionColumn = <T extends unknown>(
  actions: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: (data: T) => void;
    variant?: "default" | "destructive" | "outline";
  }>
): ColumnDef<T> => ({
  id: "actions",
  header: "Actions",
  cell: ({ row }) => (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => action.onClick(row.original)}
        >
          {action.icon}
          <span className="sr-only">{action.label}</span>
        </Button>
      ))}
    </div>
  )
});