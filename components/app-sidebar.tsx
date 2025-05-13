"use client";
import * as React from "react";
import {
  BarChart,
  BookOpen,
  Home,
  Users,
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
  items?: {
    title: string;
    url: string;
  }[];
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
      { title: "Utilisateurs", url: "/dashboard/utilisateurs" },
      {
        title: "Rôles et permissions",
        url: "/dashboard/roles",
      },
      { title: "Formateurs", url: "/dashboard/formateurs" },
      { title: "Participants", url: "/dashboard/participants" },
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
      },
      {
        title: "Sessions planifiées",
        url: "/dashboard/sessions",
      },
      {
        title: "Calendrier des seances",
        url: "/dashboard/calendrier",
      },
      {
        title: "Questionnaires",
        url: "/dashboard/questionnaires",
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
      },
      {
        title: "Progression des formations",
        url: "/dashboard/rapports/progression",
      },
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
