"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Calendar, FileText, Home, User } from "lucide-react"

const navItems = [
  {
    name: "Tableau de bord",
    href: "/espace-formateur",
    icon: Home,
  },
  {
    name: "Formations",
    href: "/espace-formateur/formations",
    icon: FileText,
  },
  {
    name: "Sessions",
    href: "/espace-formateur/sessions",
    icon: Calendar,
  },
  {
    name: "Fichiers",
    href: "/espace-formateur/fichiers",
    icon: User,
  },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-12 items-center">
        <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden md:inline">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
