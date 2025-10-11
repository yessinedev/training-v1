"use client"

import { Calendar, BadgeIcon as Certificate, ClipboardCheck, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileNavProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-950 border-t dark:border-gray-800">
      <div className="grid grid-cols-4 py-2">
        <Button
          variant={activeTab === "formations" ? "default" : "ghost"}
          className="flex flex-col items-center justify-center h-16 rounded-none"
          onClick={() => setActiveTab("formations")}
        >
          <GraduationCap className="h-5 w-5" />
          <span className="text-xs mt-1">Formations</span>
        </Button>
        <Button
          variant={activeTab === "schedule" ? "default" : "ghost"}
          className="flex flex-col items-center justify-center h-16 rounded-none"
          onClick={() => setActiveTab("schedule")}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs mt-1">Schedule</span>
        </Button>
        <Button
          variant={activeTab === "certificates" ? "default" : "ghost"}
          className="flex flex-col items-center justify-center h-16 rounded-none"
          onClick={() => setActiveTab("certificates")}
        >
          <Certificate className="h-5 w-5" />
          <span className="text-xs mt-1">Certificates</span>
        </Button>
        <Button
          variant={activeTab === "attendance" ? "default" : "ghost"}
          className="flex flex-col items-center justify-center h-16 rounded-none"
          onClick={() => setActiveTab("attendance")}
        >
          <ClipboardCheck className="h-5 w-5" />
          <span className="text-xs mt-1">Attendance</span>
        </Button>
      </div>
    </div>
  )
}
