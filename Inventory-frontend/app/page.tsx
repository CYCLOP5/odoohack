"use client"

import { useState, useEffect } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import LandingPage from "@/components/landing-page"
import AuthPage from "@/components/auth-page"
import AppLayout from "@/components/app-layout"
import { getFirebaseAuth } from "@/lib/firebase"

type AppView = "landing" | "auth" | "app"

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>("landing")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getFirebaseAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentView("app")
      } else {
        setCurrentView("landing")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    const auth = getFirebaseAuth()
    try {
      await signOut(auth)
    } finally {
      setCurrentView("landing")
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <main>
      {currentView === "landing" && <LandingPage onNavigateToAuth={() => setCurrentView("auth")} />}
      {currentView === "auth" && (
        <AuthPage onBackToLanding={() => setCurrentView("landing")} onLoginSuccess={() => setCurrentView("app")} />
      )}
      {currentView === "app" && <AppLayout onLogout={handleLogout} />}
    </main>
  )
}
