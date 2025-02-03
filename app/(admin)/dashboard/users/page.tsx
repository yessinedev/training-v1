
import AddUserForm from "@/components/user/AddUserForm";
import UsersTable from "@/components/user/users-table";

export default function UsersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Users</h2>
        <AddUserForm />
      </div>
      <UsersTable />
    </div>
  );
}
