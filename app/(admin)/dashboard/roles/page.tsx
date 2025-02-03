
import RolesTable from "@/components/role/role-table";
import AddRoleForm from "@/components/user/AddRoleForm";

export default function RolesPage() {

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Roles</h2>
        <AddRoleForm />
      </div>
      <RolesTable />
    </div>
  );
}