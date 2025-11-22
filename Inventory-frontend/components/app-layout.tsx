"use client"

import type React from "react"
import Navbar1 from "./ui/navbar1"
import { useState } from "react"
import { Menu, X, Home, Package, FileText, Truck, Share2, Settings, BarChart3, User, LogOut } from "lucide-react"
import Dashboard from "./dashboard"

interface AppLayoutProps {
  onLogout: () => void
}

interface NavLink {
  id: string
  label: string
  icon: React.ReactNode
  section: "overview" | "master" | "operations" | "tools" | "reporting" | "system"
}

export default function AppLayout({ onLogout }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState<string>("dashboard")
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // const navLinks: NavLink[] = [
  //   { id: "dashboard", label: "Dashboard", icon: <Home size={20} />, section: "overview" },
  //   { id: "items", label: "Items", icon: <Package size={20} />, section: "master" },
  //   { id: "receipts", label: "Receipts", icon: <FileText size={20} />, section: "operations" },
  //   { id: "deliveries", label: "Delivery Orders", icon: <Truck size={20} />, section: "operations" },
  //   { id: "transfers", label: "Internal Transfer", icon: <Share2 size={20} />, section: "operations" },
  //   { id: "adjustments", label: "Inventory Adjustment", icon: <Settings size={20} />, section: "operations" },
  //   { id: "search", label: "Search", icon: <FileText size={20} />, section: "tools" },
  //   { id: "tags", label: "Tags", icon: <FileText size={20} />, section: "tools" },
  //   { id: "workflows", label: "Workflows", icon: <FileText size={20} />, section: "tools" },
  //   { id: "reports", label: "Reports", icon: <BarChart3 size={20} />, section: "reporting" },
  //   { id: "settings", label: "Settings", icon: <Settings size={20} />, section: "system" },
  // ]

  // const groupedNavLinks = {
  //   overview: navLinks.filter((link) => link.section === "overview"),
  //   master: navLinks.filter((link) => link.section === "master"),
  //   operations: navLinks.filter((link) => link.section === "operations"),
  //   tools: navLinks.filter((link) => link.section === "tools"),
  //   reporting: navLinks.filter((link) => link.section === "reporting"),
  //   system: navLinks.filter((link) => link.section === "system"),
  // }

  // const handleNavClick = (linkId: string) => {
  //   setCurrentView(linkId)
  //   if (window.innerWidth < 768) {
  //     setIsSidebarOpen(false)
  //   }
  // }

  const renderContent = () => {
    return (
      <Dashboard
        onLogout={onLogout}
        initialView={currentView as any}
        onViewChange={(newView) => setCurrentView(newView as any)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content Area */}
      <header className="absolute -top-5 left-10 right-0 z-50">
        {/* <Navbar1 /> */}
      </header>
      <main className={`flex-1 transition-all duration-300 ease-in-out `}>
        <div>{renderContent()}</div>
      </main>
    </div>

  )
}
