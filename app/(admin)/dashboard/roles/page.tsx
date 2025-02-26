import RolesTable from "@/components/role/role-table";

export default function RolesPage() {

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Roles</h2>
      </div>
      <RolesTable />
    </div>
  );
}