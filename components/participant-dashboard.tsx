"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormationsList } from "@/components/formations-list";
import { SessionSchedule } from "@/components/session-schedule";
import { CertificatesList } from "@/components/certificates-list";
import { AttendanceStatus } from "@/components/attendance-status";
import { MobileNav } from "@/components/mobile-nav";
import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Participant } from "@/types";
import { SignOutButton } from "@clerk/nextjs";

interface ParticipantDashboardProps {
  participant: Participant;
}

export function ParticipantDashboard({
  participant,
}: ParticipantDashboardProps) {
  const [activeTab, setActiveTab] = useState("formations");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const getInitials = (nom: string, prenom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white dark:bg-gray-950 dark:border-gray-800">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Portail de formation</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
              <span className="sr-only">Notifications</span>
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${participant.user_id}`}
                  alt={participant.user.nom}
                />
                <AvatarFallback>
                  {getInitials(participant.user.nom, participant.user.prenom)}
                </AvatarFallback>
              </Avatar>
              {!isMobile && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{`${participant.user.prenom} ${participant.user.nom}`}</span>
                  <span className="text-xs text-muted-foreground">
                    {participant.poste}
                  </span>
                </div>
              )}
            </div>
            <SignOutButton>
              <LogOut className="h-5 w-5" />
            </SignOutButton>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Bienvenue, {participant.user.prenom} !
          </h2>
          <p className="text-muted-foreground">
            Voici un aperçu de vos activités et de votre progression en formation.
          </p>
        </div>

        {isMobile ? (
          <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
        ) : (
          <Tabs
            defaultValue="formations"
            className="space-y-4"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="formations">Formations</TabsTrigger>
              <TabsTrigger value="schedule">Planning</TabsTrigger>
              <TabsTrigger value="certificates">Certificats</TabsTrigger>
              <TabsTrigger value="attendance">Présence</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <div className="mt-6">
          {activeTab === "formations" && (
            <FormationsList participant={participant} />
          )}
          {activeTab === "schedule" && (
            <SessionSchedule participant={participant} />
          )}
          {activeTab === "certificates" && (
            <CertificatesList participant={participant} />
          )}
          {activeTab === "attendance" && (
            <AttendanceStatus participant={participant} />
          )}
        </div>
      </main>
    </div>
  );
}
