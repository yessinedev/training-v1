"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { fetchSeancesByFormateurId } from "@/services/seanceService"
import { useQuery } from "@tanstack/react-query"
import { Seance } from "@/types"

export function SessionsCalendar({ formateurId }: { formateurId: string }) {
  const { data: sessions, isLoading: isLoadingFormation } = useQuery<Seance[]>({
    queryKey: ["seances-formateur", formateurId],
    queryFn: () => fetchSeancesByFormateurId(formateurId),
    enabled: !!formateurId,
  });
  const [currentDate, setCurrentDate] = useState(new Date())

  // Obtenir le premier jour du mois
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  // Obtenir le dernier jour du mois
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  // Obtenir le jour de la semaine du premier jour (0 = dimanche, 1 = lundi, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  // Ajuster pour commencer la semaine le lundi (0 = lundi, 6 = dimanche)
  const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  // Nombre total de jours dans le mois
  const daysInMonth = lastDayOfMonth.getDate()

  // Créer un tableau de jours pour le calendrier
  const days = []

  // Ajouter les jours du mois précédent
  const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()
  for (let i = adjustedFirstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthLastDay - i),
      isCurrentMonth: false,
    })
  }

  // Ajouter les jours du mois en cours
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
      isCurrentMonth: true,
    })
  }

  // Ajouter les jours du mois suivant
  const remainingDays = 42 - days.length // 6 semaines * 7 jours = 42
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
      isCurrentMonth: false,
    })
  }

  // Fonction pour obtenir les sessions pour une date donnée
  const getSessionsForDate = (date: Date) => {
    return sessions?.filter((session) => {
      if (!session.date) return false
      const sessionDate = new Date(session.date)
      return (
        sessionDate.getDate() === date.getDate() &&
        sessionDate.getMonth() === date.getMonth() &&
        sessionDate.getFullYear() === date.getFullYear()
      )
    })
  }

  // Fonction pour naviguer au mois précédent
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Fonction pour naviguer au mois suivant
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Fonction pour naviguer au mois actuel
  const goToCurrentMonth = () => {
    setCurrentDate(new Date())
  }

  // Noms des jours de la semaine
  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

  // Noms des mois
  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" onClick={goToCurrentMonth}>
          {"Aujourd'hui"}
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div key={day} className="text-center font-medium py-2">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const isToday =
            day.date.getDate() === new Date().getDate() &&
            day.date.getMonth() === new Date().getMonth() &&
            day.date.getFullYear() === new Date().getFullYear()

          const daysSessions = getSessionsForDate(day.date)

          return (
            <Card
              key={index}
              className={`min-h-[100px] p-2 ${
                !day.isCurrentMonth ? "bg-muted/50" : ""
              } ${isToday ? "border-primary" : ""}`}
            >
              <div className="flex flex-col h-full">
                <div
                  className={`text-right ${!day.isCurrentMonth ? "text-muted-foreground" : ""} ${
                    isToday ? "font-bold" : ""
                  }`}
                >
                  {day.date.getDate()}
                </div>

                <div className="flex-1 mt-1 space-y-1">
                  {daysSessions?.map((session) => (
                    <Link key={session.seance_id} href={`/formateur/sessions/${session.seance_id}`} className="block">
                      <Badge variant="outline" className="w-full justify-start text-xs truncate hover:bg-muted">
                        {session.heure} - {session?.action?.theme.libelle_theme.substring(0, 15)}
                        {(session?.action?.theme?.libelle_theme?.length ?? 0) > 15 ? "..." : ""}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
