
import { UserOverviewCards } from "@/components/user/user-overview-cards";
import UsersTable from "@/components/user/users-table";

export default function UsersPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-start space-y-4 md:flex-col md:items-start md:space-y-1">
        <UserOverviewCards />
        <h2 className="text-2xl font-bold">Liste des Utilisateurs</h2>
      </div>
      <UsersTable />
    </div>
  );
}
