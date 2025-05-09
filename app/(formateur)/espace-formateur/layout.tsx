import type React from "react"
import { Header } from "@/components/espace-formateur/header"
import { NavBar } from "@/components/espace-formateur/nav-bar"

export default function FormateurLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col container mx-auto">
      <Header />
      <NavBar />
      <main className="flex-1 px-4 py-6">{children}</main>
    </div>
  )
}
