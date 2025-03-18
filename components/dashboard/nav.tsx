"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  UserCog,
  GraduationCap,
  UserPlus,
  BookOpen,
  Home,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { title } from "process";

const navItems = [
  {
    title: "Accueil",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Gestion d'accès",
    icon: Users,
    children: [
      {
        title: "Gestion d'utilisateurs",
        href: "/dashboard/users",
        icon: Users,
      },
      {
        title: "Gestion des roles",
        href: "/dashboard/roles",
        icon: UserCog,
      },
      {
        title: "Gestion des formateurs",
        href: "/dashboard/formateurs",
        icon: GraduationCap,
      },
      {
        title: "Gestion des participants",
        href: "/dashboard/participants",
        icon: UserPlus,
      },
    ],
  },
  {
    title: "Formations",
    icon: BookOpen,
    children: [
      {
        title: "Catalog de Formations",
        href: "/dashboard/formations",
        icon: BookOpen
      },
      {
        title: "Domaines",
        href: "/dashboard/domaines",
        icon: BookOpen
      },
      {
        title: "Thémes",
        href: "/dashboard/themes",
        icon: BookOpen
      }
    ]
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1 w-[200px]">
      {navItems.map((item) => (
        <div key={item.title} className="w-full">
          <Button
            variant={pathname === item.href ? "secondary" : "ghost"}
            className="justify-start w-full"
            asChild
          >
            {item.href ? (
              <Link href={item.href} className="text-blue-900 font-extrabold">
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ) : (
              <div className="text-blue-900 font-extrabold">
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </div>
            )}
          </Button>
          {item.children && (
            <div className="pl-4">
              {item.children.map((child) => (
                <Button
                  key={child.href}
                  variant={pathname === child.href ? "secondary" : "ghost"}
                  className="justify-start w-full"
                  asChild
                >
                  <Link href={child.href} className="text-blue-900 font-light">
                    {child.icon && <child.icon className="mr-2 h-4 w-4" />}
                    <span className="ml-2">{child.title}</span>
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
