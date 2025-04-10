"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { fetchUsers } from "@/services/userService";
import { User } from "@/types";
import { UsersIcon, ActivityIcon, PieChartIcon, ClockIcon } from "lucide-react";

export function UserOverviewCards() {
  const {
    data: users,
    isLoading,
    isError,
  } = useAuthQuery(["users"], fetchUsers);

  if (isLoading) return <div>Loading...</div>;
  // Calculate statistics
  const totalUsers = users?.length;
  const activeUsers = users?.length; // In this mock, all users are considered active
  const inactiveUsers = 0;

  // Count users by role
  const roleDistribution = users?.reduce((acc, user: User) => {
    acc[user.role.role_name] = (acc[user.role.role_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get most recent user
  const mostRecentUser = users[users?.length - 1];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <UsersIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Utilisateurs
              </p>
              <h3 className="text-xl font-bold">{totalUsers} Utilisateurs</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
              <ActivityIcon className="h-6 w-6 text-green-700 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Statut Utilisateurs
              </p>
              <h3 className="text-xl font-bold">
                <span className="text-green-600 dark:text-green-400">
                  🟢 {activeUsers} Actifs
                </span>
                {inactiveUsers > 0 && (
                  <span className="text-red-600 dark:text-red-400 ml-2">
                    • 🔴 {inactiveUsers} Inactifs
                  </span>
                )}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <PieChartIcon className="h-6 w-6 text-blue-700 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Distribution des Rôles
              </p>
              {Object.entries(roleDistribution).map(([role, count]) => (
                <h3 className="text-sm font-bold">{`${count} ${role}`}</h3>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
              <ClockIcon className="h-6 w-6 text-purple-700 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Activité Récente
              </p>
              <h3 className="text-base font-medium">
                Dernier utilisateur ajouté:
                <br />
                {mostRecentUser.prenom} {mostRecentUser.nom}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
