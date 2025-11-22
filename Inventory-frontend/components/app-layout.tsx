"use client"

import type React from "react"
import { useState } from "react"
import { 
  Menu, X, Home, Package, FileText, Truck, Share2, Settings, 
  BarChart3, User, LogOut, ChevronRight, ChevronLeft, Search, Tag, Workflow, Sliders 
} from "lucide-react"
import Dashboard from "./dashboard"
import Background3D from "./3d-background"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
  onLogout: () => void | Promise<void>
}

interface NavLink {
  id: string
  label: string
  icon: React.ReactNode
  section: "overview" | "master" | "operations" | "tools" | "reporting" | "system"
}

export default function AppLayout({ onLogout }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [currentView, setCurrentView] = useState<string>("dashboard")

  const navLinks: NavLink[] = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20} />, section: "overview" },
    { id: "items", label: "Items", icon: <Package size={20} />, section: "master" },
    { id: "receipts", label: "Receipts", icon: <FileText size={20} />, section: "operations" },
    { id: "deliveries", label: "Delivery Orders", icon: <Truck size={20} />, section: "operations" },
    { id: "transfers", label: "Internal Transfer", icon: <Share2 size={20} />, section: "operations" },
    { id: "adjustments", label: "Inventory Adjustment", icon: <Sliders size={20} />, section: "operations" },
    { id: "search", label: "Search", icon: <Search size={20} />, section: "tools" },
    { id: "tags", label: "Tags", icon: <Tag size={20} />, section: "tools" },
    { id: "workflows", label: "Workflows", icon: <Workflow size={20} />, section: "tools" },
    { id: "reports", label: "Reports", icon: <BarChart3 size={20} />, section: "reporting" },
    { id: "settings", label: "Settings", icon: <Settings size={20} />, section: "system" },
  ]

  const groupedNavLinks = {
    overview: navLinks.filter((link) => link.section === "overview"),
    master: navLinks.filter((link) => link.section === "master"),
    operations: navLinks.filter((link) => link.section === "operations"),
    tools: navLinks.filter((link) => link.section === "tools"),
    reporting: navLinks.filter((link) => link.section === "reporting"),
    system: navLinks.filter((link) => link.section === "system"),
  }

  const handleNavClick = (linkId: string) => {
    setCurrentView(linkId)
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <Background3D />
      
      {/* Floating Glass Sidebar */}
      <aside
        className={cn(
          "fixed left-4 top-4 bottom-4 z-50 glass-panel-dark rounded-2xl transition-all duration-300 ease-in-out flex flex-col shadow-2xl border border-white/10",
          isSidebarOpen ? "w-72" : "w-20"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className={cn("flex items-center gap-3 overflow-hidden transition-all", !isSidebarOpen && "w-0 opacity-0")}>
            
            <h1 className="text-xl font-bold text-white whitespace-nowrap">Odoo Inventory IQ</h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80"
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
          {Object.entries(groupedNavLinks).map(([section, links]) => (
            <div key={section}>
              {isSidebarOpen && (
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3 px-3">
                  {section}
                </p>
              )}
              <div className="space-y-1">
                {links.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                      currentView === link.id 
                        ? "bg-gradient-to-br from-[#714B67] to-[#017E84] text-white shadow-md" 
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    )}
                    title={!isSidebarOpen ? link.label : ""}
                  >
                    <span className={cn("flex-shrink-0 transition-transform duration-200", currentView === link.id && "scale-110")}>
                      {link.icon}
                    </span>
                    {isSidebarOpen && (
                      <span className="text-sm font-medium whitespace-nowrap">{link.label}</span>
                    )}
                    {currentView === link.id && (
                      <div className="absolute inset-0 bg-white/10 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className={cn("flex items-center gap-3", !isSidebarOpen && "justify-center")}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#714B67] to-[#017E84] flex items-center justify-center border-2 border-white/20 shadow-sm">
              <User size={20} className="text-white" />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">Admin User</p>
                <p className="text-xs text-white/60 truncate">admin@odooinventoryiq.com</p>
              </div>
            )}
            {isSidebarOpen && (
              <button
                onClick={() => void onLogout()}
                className="p-2 hover:bg-white/10 text-white/60 hover:text-red-400 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out h-screen overflow-hidden",
          isSidebarOpen ? "ml-80" : "ml-28"
        )}
      >
        <div className="h-full p-4 overflow-y-auto scrollbar-hide">
          <Dashboard
            onLogout={onLogout}
            initialView={currentView as any}
            onViewChange={(newView) => setCurrentView(newView as any)}
          />
        </div>
      </main>
    </div>
  )
}
