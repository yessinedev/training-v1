'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, UserCog, GraduationCap, UserPlus, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Roles",
    href: "/dashboard/roles",
    icon: UserCog,
  },
  {
    title: "Formateurs",
    href: "/dashboard/formateurs",
    icon: GraduationCap,
  },
  {
    title: "Participants",
    href: "/dashboard/participants",
    icon: UserPlus,
  },
  {
    title: "Formations",
    href: "/dashboard/formations",
    icon: BookOpen,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1 p-4">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "secondary" : "ghost"}
          className="justify-start"
          asChild
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  );
}