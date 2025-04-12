"use client";
import * as React from "react";
import {
  BarChart,
  BookOpen,
  EuroIcon,
  Home,
  PenTool,
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
import { useUser } from "@clerk/nextjs";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Tableau de bord",
      url: "/dashboard",
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
          url: "/dashboard/utilisateurs",
        },
        {
          title: "Rôles et permissions",
          url: "/dashboard/roles",
        },
        {
          title: "Formateurs",
          url: "/dashboard/formateurs",
        },
        {
          title: "Participants",
          url: "/dashboard/participants",
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
      ],
    },
    {
      title: "Gestion financière",
      icon: EuroIcon,
      url: "#",
      items: [
        {
          title: "Devis",
          url: "/dashboard/devis",
        },
        {
          title: "Facturation",
          url: "/dashboard/factures",
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
      title: "Applications",
      url: "#",
      icon: PenTool,
      items: [
        {
          title: "Questionnaires",
          url: "/dashboard/questionnaires",
        },
        {
          title: "Évaluations",
          url: "/dashboard/evaluations",
        },
        {
          title: "Certificats",
          url: "/dashboard/certificats",
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
          url: "/dashboard/settings",
        },
        {
          title: "Notifications",
          url: "/dashboard/notifications",
        },
        {
          title: "Intégrations",
          url: "/dashboard/integrations",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  const role = (
    user?.publicMetadata as { role: { role_name: string; role_id: number } }
  )?.role.role_name;

  const filterNavItems = (items: typeof data.navMain) => {
    if (!role) return [];
    
    return items.filter((item) => {
      // Always show dashboard
      if (item.url === "/dashboard") return true;

      // Admin sees all items
      if (role === "ADMIN") return true;

      // Gestionnaire sees specific sections
      if (role === "GESTIONNAIRE") {
        const allowedTitles = [
          "Gestion des formations",
          "Analyses et rapports",
          "Paramètres",
        ];
        return allowedTitles.includes(item.title);
      }

      return false;
    });
  };

  const filteredNavMain = filterNavItems(data.navMain);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
