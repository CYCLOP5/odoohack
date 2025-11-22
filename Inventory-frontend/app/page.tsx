"use client"

import { useState } from "react"
import LandingPage from "@/components/landing-page"
import AuthPage from "@/components/auth-page"
import AppLayout from "@/components/app-layout"

type AppView = "landing" | "auth" | "app"

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>("landing")

  return (
    <main>
      {currentView === "landing" && <LandingPage onNavigateToAuth={() => setCurrentView("auth")} />}
      {currentView === "auth" && (
        <AuthPage onBackToLanding={() => setCurrentView("landing")} onLoginSuccess={() => setCurrentView("app")} />
      )}
      {currentView === "app" && <AppLayout onLogout={() => setCurrentView("landing")} />}
    </main>
  )
}
