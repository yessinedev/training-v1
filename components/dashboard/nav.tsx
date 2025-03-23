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
  Calculator,
  FileText,
  Wallet,
  LineChart,
  DollarSign,
  Calendar,
  ClipboardList,
  Folder,
  LayoutList,
  Tag,
  File,
  Euro,
  BarChart,
  TrendingUp,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Gestion des accès",
    icon: Users,
    children: [
      {
        title: "Utilisateurs",
        href: "/dashboard/users",
        icon: UserPlus,
      },
      {
        title: "Rôles et permissions",
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
        icon: Users,
      },
    ],
  },
  {
    title: "Gestion des formations",
    icon: BookOpen,
    children: [
      {
        title: "Catalogue de formations",
        href: "/dashboard/formations",
        icon: BookOpen,
      },
      {
        title: "Sessions planifiées",
        href: "/dashboard/sessions",
        icon: Calendar,
      },
      {
        title: "Inscriptions",
        href: "/dashboard/inscriptions",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Contenu pédagogique",
    icon: Folder,
    children: [
      {
        title: "Domaines",
        href: "/dashboard/domaines",
        icon: Folder,
      },
      {
        title: "Thèmes",
        href: "/dashboard/themes",
        icon: Tag,
      },
    ],
  },
  {
    title: "Gestion financière",
    icon: Euro,
    children: [
      {
        title: "Devis",
        href: "/dashboard/finance/devis",
        icon: FileText,
      },
      {
        title: "Facturation",
        href: "/dashboard/finance/factures",
        icon: File,
      },
      {
        title: "Coûts et budgets",
        href: "/dashboard/finance/couts",
        icon: Calculator,
      },
      {
        title: "Suivi des paiements",
        href: "/dashboard/finance/paiements",
        icon: Wallet,
      },
      {
        title: "Rapports financiers",
        href: "/dashboard/finance/rapports",
        icon: LineChart,
      },
    ],
  },
  {
    title: "Analyses et rapports",
    icon: BarChart,
    children: [
      {
        title: "Participation",
        href: "/dashboard/rapports/participation",
        icon: Users,
      },
      {
        title: "Progression des formations",
        href: "/dashboard/rapports/progression",
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "Paramètres",
    icon: Settings,
    href: "/dashboard/parametres",
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1 w-[250px]">
      {navItems.map((item) => (
        <div key={item.title} className="w-full overflow-hidden">
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
