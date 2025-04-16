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

// Define types for navigation items
type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
};

// Navigation data for ADMIN
const adminNav: NavItem[] = [
  { title: "Tableau de bord", url: "/dashboard", icon: Home, isActive: true },
  {
    title: "Gestion des accès",
    url: "#",
    icon: Users,
    items: [
      { title: "Utilisateurs", url: "/dashboard/utilisateurs", icon: Users },
      { title: "Rôles et permissions", url: "/dashboard/roles", icon: Settings2 },
      { title: "Formateurs", url: "/dashboard/formateurs", icon: UserCheck },
      { title: "Participants", url: "/dashboard/participants", icon: Users },
    ],
  },
  {
    title: "Gestion des formations",
    url: "#",
    icon: BookOpen,
    items: [
      { title: "Catalogue de formations", url: "/dashboard/catalogue", icon: BookOpen },
      { title: "Sessions planifiées", url: "/dashboard/sessions", icon: Calendar },
      { title: "Calendrier des seances", url: "/dashboard/calendrier", icon: Calendar },
    ],
  },
  {
    title: "Gestion financière",
    icon: EuroIcon,
    url: "#",
    items: [
      { title: "Devis", url: "/dashboard/devis", icon: FileText },
      { title: "Facturation", url: "/dashboard/factures", icon: FileText },
      { title: "Coûts et budgets", url: "/finance/couts", icon: EuroIcon },
      { title: "Suivi des paiements", url: "/finance/paiements", icon: EuroIcon },
      { title: "Rapports financiers", url: "/finance/rapports", icon: BarChart },
    ],
  },
  {
    title: "Analyses et rapports",
    icon: BarChart,
    url: "#",
    items: [
      { title: "Participation", url: "/dashboard/rapports/participation", icon: BarChart },
      { title: "Progression des formations", url: "/dashboard/rapports/progression", icon: BarChart },
    ],
  },
  {
    title: "Applications",
    url: "#",
    icon: PenTool,
    items: [
      { title: "Questionnaires", url: "/dashboard/questionnaires", icon: PenTool },
      { title: "Évaluations", url: "/dashboard/evaluations", icon: ClipboardList },
      { title: "Certificats", url: "/dashboard/certificats", icon: FileText },
    ],
  },
  {
    title: "Paramètres",
    url: "#",
    icon: Settings2,
    items: [
      { title: "Généraux", url: "/dashboard/settings", icon: Settings2 },
      { title: "Notifications", url: "/dashboard/notifications", icon: Settings2 },
      { title: "Intégrations", url: "/dashboard/integrations", icon: Settings2 },
    ],
  },
];

// Navigation data for GESTIONNAIRE
const gestionnaireNav: NavItem[] = [
  { title: "Tableau de bord", url: "/dashboard", icon: Home, isActive: true },
  {
    title: "Gestion des formations",
    url: "#",
    icon: BookOpen,
    items: [
      { title: "Catalogue de formations", url: "/dashboard/catalogue", icon: BookOpen },
      { title: "Sessions planifiées", url: "/dashboard/sessions", icon: Calendar },
      { title: "Calendrier des seances", url: "/dashboard/calendrier", icon: Calendar },
    ],
  },
  {
    title: "Analyses et rapports",
    icon: BarChart,
    url: "#",
    items: [
      { title: "Participation", url: "/dashboard/rapports/participation", icon: BarChart },
      { title: "Progression des formations", url: "/dashboard/rapports/progression", icon: BarChart },
    ],
  },
  {
    title: "Paramètres",
    url: "#",
    icon: Settings2,
    items: [
      { title: "Généraux", url: "/dashboard/settings", icon: Settings2 },
      { title: "Notifications", url: "/dashboard/notifications", icon: Settings2 },
    ],
  },
];

// Navigation data for FORMATEUR
const formateurNav: NavItem[] = [
  { title: "Tableau de bord", url: "/dashboard", icon: Home, isActive: true },
  { title: "Mes Sessions", url: "/dashboard/sessions", icon: Calendar },
  { title: "Calendrier", url: "/dashboard/calendrier", icon: Calendar },
  { title: "Mes Participants", url: "/dashboard/participants", icon: Users },
  { title: "Évaluations", url: "/dashboard/evaluations", icon: PenTool },
];

// Navigation data for PARTICIPANT
const participantNav: NavItem[] = [
  { title: "Tableau de bord", url: "/dashboard", icon: Home, isActive: true },
  { title: "Mes Formations", url: "/dashboard/catalogue", icon: BookOpen },
  { title: "Mon Calendrier", url: "/dashboard/calendrier", icon: Calendar },
  { title: "Mes Évaluations", url: "/dashboard/evaluations", icon: ClipboardList },
  { title: "Mes Attestations", url: "/dashboard/certificats", icon: FileText },
];

// const data = {
//   user: {
//     name: ",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
// };

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  const role = (
    user?.publicMetadata as { role: { role_name: string; role_id: number } }
  )?.role.role_name;

  const getNavItemsByRole = (roleName?: string): NavItem[] => {
    switch (roleName) {
      case "ADMIN":
        return adminNav;
      case "GESTIONNAIRE":
        return gestionnaireNav;
      case "FORMATEUR":
        return formateurNav;
      case "PARTICIPANT":
        return participantNav;
      default:
        return []; // Return empty array or a default set if no role/unknown role
    }
  };

  const navItems = getNavItemsByRole(role);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: user?.firstName!, email: user?.emailAddresses[0].emailAddress!, avatar: user?.imageUrl! }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
