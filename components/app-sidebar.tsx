"use client";
import * as React from "react";
import {
  BarChart,
  BookOpen,
  Home,
  PenTool,
  Settings2,
  Users,
  Calendar,
  FileText,
  UserCheck,
  ClipboardList,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";

import { LucideIcon } from "lucide-react";

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
};

// Navigation data for ADMIN
const navItems: NavItem[] = [
  { title: "Tableau de bord", url: "/dashboard", icon: Home, isActive: false },
  {
    title: "Gestion des accès",
    url: "#",
    icon: Users,
    isActive: true,
    items: [
      { title: "Utilisateurs", url: "/dashboard/utilisateurs", icon: Users },
      {
        title: "Rôles et permissions",
        url: "/dashboard/roles",
        icon: Settings2,
      },
      { title: "Formateurs", url: "/dashboard/formateurs", icon: UserCheck },
      { title: "Participants", url: "/dashboard/participants", icon: Users },
    ],
  },
  {
    title: "Gestion des formations",
    url: "#",
    icon: BookOpen,
    isActive: true,
    items: [
      {
        title: "Catalogue de formations",
        url: "/dashboard/catalogue",
        icon: BookOpen,
      },
      {
        title: "Sessions planifiées",
        url: "/dashboard/sessions",
        icon: Calendar,
      },
      {
        title: "Calendrier des seances",
        url: "/dashboard/calendrier",
        icon: Calendar,
      },
    ],
  },
  // {
  //   title: "Gestion financière",
  //   icon: EuroIcon,
  //   url: "#",
  //   isActive: true,
  //   items: [
  //     { title: "Devis", url: "/dashboard/devis", icon: FileText },
  //     { title: "Facturation", url: "/dashboard/factures", icon: FileText },
  //     { title: "Coûts et budgets", url: "/finance/couts", icon: EuroIcon },
  //     { title: "Suivi des paiements", url: "/finance/paiements", icon: EuroIcon },
  //     { title: "Rapports financiers", url: "/finance/rapports", icon: BarChart },
  //   ],
  // },
  {
    title: "Analyses et rapports",
    icon: BarChart,
    url: "#",
    isActive: true,
    items: [
      {
        title: "Participation",
        url: "/dashboard/rapports/participation",
        icon: BarChart,
      },
      {
        title: "Progression des formations",
        url: "/dashboard/rapports/progression",
        icon: BarChart,
      },
    ],
  },
  {
    title: "Applications",
    url: "#",
    icon: PenTool,
    isActive: true,
    items: [
      {
        title: "Questionnaires",
        url: "/dashboard/questionnaires",
        icon: PenTool,
      },
      {
        title: "Évaluations",
        url: "/dashboard/evaluations",
        icon: ClipboardList,
      },
      { title: "Certificats", url: "/dashboard/certificats", icon: FileText },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.firstName!,
            email: user?.emailAddresses[0].emailAddress!,
            avatar: user?.imageUrl!,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
