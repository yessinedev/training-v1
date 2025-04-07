"use client";

import * as React from "react";
import {
  BarChart,
  BookOpen,
  EuroIcon,
  Home,
  Settings2,
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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Tableau de bord",
      url: "/admin-dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Gestion des accès",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Utilisateurs",
          url: "/admin-dashboard/users",
        },
        {
          title: "Rôles et permissions",
          url: "/admin-dashboard/roles",
        },
        {
          title: "Formateurs",
          url: "/admin-dashboard/formateurs",
        },
        {
          title: "Participants",
          url: "/admin-dashboard/participants",
        },
      ],
    },
    {
      title: "Gestion des formations",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Catalogue de formations",
          url: "/admin-dashboard/catalogue",
        },
        {
          title: "Sessions planifiées",
          url: "/admin-dashboard/sessions",
        },
        {
          title: "Calendrier des seances",
          url: "/admin-dashboard/calendrier",
        },
      ],
    },
    {
      title: "Gestion financière",
      icon: EuroIcon,
      url: "#",
      items: [
        {
          title: "Devis",
          url: "/admin-dashboard/devis",
        },
        {
          title: "Facturation",
          url: "/admin-dashboard/factures",
        },
        {
          title: "Coûts et budgets",
          url: "/finance/couts",
        },
        {
          title: "Suivi des paiements",
          url: "/finance/paiements",
        },
        {
          title: "Rapports financiers",
          url: "/finance/rapports",
        },
      ],
    },
    {
      title: "Analyses et rapports",
      icon: BarChart,
      url: "#",
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
    {
      title: "Paramètres",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Généraux",
          url: "/admin-dashboard/settings",
        },
        {
          title: "Notifications",
          url: "/admin-dashboard/notifications",
        },
        {
          title: "Intégrations",
          url: "/admin-dashboard/integrations",
        },
      ],
    },
  ],
  
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
