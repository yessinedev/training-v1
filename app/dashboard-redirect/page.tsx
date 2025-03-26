'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function DashboardRedirect() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      console.log(user.publicMetadata);
      // Assuming the role is stored in public metadata
      const role = (user.publicMetadata as { role: { role_name: string, role_id: number } }).role.role_name;

      if (role === "ADMIN") {
        router.replace("/admin-dashboard");
      } else if (role === "GESTIONNAIRE") {
        router.replace("/gestionnaire-dashboard");
      } else {
        router.replace("/default-dashboard");
      }
    }
  }, [user, router]);

  return <div>Redirecting...</div>;
}
