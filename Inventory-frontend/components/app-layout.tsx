"use client"

import type React from "react"

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

  const navLinks: NavLink[] = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20} />, section: "overview" },
    { id: "items", label: "Items", icon: <Package size={20} />, section: "master" },
    { id: "receipts", label: "Receipts", icon: <FileText size={20} />, section: "operations" },
    { id: "deliveries", label: "Delivery Orders", icon: <Truck size={20} />, section: "operations" },
    { id: "transfers", label: "Internal Transfer", icon: <Share2 size={20} />, section: "operations" },
    { id: "adjustments", label: "Inventory Adjustment", icon: <Settings size={20} />, section: "operations" },
    { id: "search", label: "Search", icon: <FileText size={20} />, section: "tools" },
    { id: "tags", label: "Tags", icon: <FileText size={20} />, section: "tools" },
    { id: "workflows", label: "Workflows", icon: <FileText size={20} />, section: "tools" },
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
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }

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
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-6 z-40 shadow-sm">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X size={24} className="text-dark-text" /> : <Menu size={24} className="text-dark-text" />}
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-red flex items-center justify-center">
            <span className="text-white font-bold text-sm">SM</span>
          </div>
          <h1 className="text-xl font-bold text-dark-text hidden sm:block">StockMaster</h1>
        </div>

        <div className="ml-auto flex items-center gap-4">
          {/* Quick Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleNavClick("dashboard")}
              className={`text-sm font-medium transition-colors ${
                currentView === "dashboard" ? "text-primary-red" : "text-dark-text hover:text-primary-red"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavClick("items")}
              className={`text-sm font-medium transition-colors ${
                currentView === "items" ? "text-primary-red" : "text-dark-text hover:text-primary-red"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => handleNavClick("reports")}
              className={`text-sm font-medium transition-colors ${
                currentView === "reports" ? "text-primary-red" : "text-dark-text hover:text-primary-red"
              }`}
            >
              Reports
            </button>
          </nav>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary-red flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="hidden sm:inline text-sm font-medium text-dark-text">Profile</span>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => {
                    handleNavClick("profile")
                    setShowProfileMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-dark-text hover:bg-gray-100 flex items-center gap-2"
                >
                  <User size={16} />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    onLogout()
                    setShowProfileMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-primary-red hover:bg-red-50 flex items-center gap-2 border-t border-gray-200"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Left Sidebar */}
        <aside
          className={`fixed left-0 top-16 bottom-0 z-30 bg-primary-red transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "w-64" : "w-16"
          } border-r border-secondary-red`}
        >
          <nav className="flex flex-col h-full overflow-y-auto">
            {/* Overview Section */}
            <div className="px-4 py-6">
              {isSidebarOpen && (
                <p className="text-xs font-semibold text-white opacity-70 uppercase tracking-wider mb-4">Overview</p>
              )}
              <div className="space-y-2">
                {groupedNavLinks.overview.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                      currentView === link.id ? "bg-secondary-red text-white" : "text-white hover:bg-red-600"
                    }`}
                    title={!isSidebarOpen ? link.label : ""}
                  >
                    <span className="flex-shrink-0">{link.icon}</span>
                    {isSidebarOpen && <span className="text-sm font-medium">{link.label}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Master Data Section */}
            <div className="px-4 py-6 border-t border-secondary-red">
              {isSidebarOpen && (
                <p className="text-xs font-semibold text-white opacity-70 uppercase tracking-wider mb-4">Master Data</p>
              )}
              <div className="space-y-2">
                {groupedNavLinks.master.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                      currentView === link.id ? "bg-secondary-red text-white" : "text-white hover:bg-red-600"
                    }`}
                    title={!isSidebarOpen ? link.label : ""}
                  >
                    <span className="flex-shrink-0">{link.icon}</span>
                    {isSidebarOpen && <span className="text-sm font-medium">{link.label}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Operations Section */}
            <div className="px-4 py-6 border-t border-secondary-red">
              {isSidebarOpen && (
                <p className="text-xs font-semibold text-white opacity-70 uppercase tracking-wider mb-4">Operations</p>
              )}
              <div className="space-y-2">
                {groupedNavLinks.operations.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                      currentView === link.id ? "bg-secondary-red text-white" : "text-white hover:bg-red-600"
                    }`}
                    title={!isSidebarOpen ? link.label : ""}
                  >
                    <span className="flex-shrink-0">{link.icon}</span>
                    {isSidebarOpen && <span className="text-sm font-medium">{link.label}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Tools Section */}
            <div className="px-4 py-6 border-t border-secondary-red">
              {isSidebarOpen && (
                <p className="text-xs font-semibold text-white opacity-70 uppercase tracking-wider mb-4">Tools</p>
              )}
              <div className="space-y-2">
                {groupedNavLinks.tools.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                      currentView === link.id ? "bg-secondary-red text-white" : "text-white hover:bg-red-600"
                    }`}
                    title={!isSidebarOpen ? link.label : ""}
                  >
                    <span className="flex-shrink-0">{link.icon}</span>
                    {isSidebarOpen && <span className="text-sm font-medium">{link.label}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Reporting Section */}
            <div className="px-4 py-6 border-t border-secondary-red">
              {isSidebarOpen && (
                <p className="text-xs font-semibold text-white opacity-70 uppercase tracking-wider mb-4">Reporting</p>
              )}
              <div className="space-y-2">
                {groupedNavLinks.reporting.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                      currentView === link.id ? "bg-secondary-red text-white" : "text-white hover:bg-red-600"
                    }`}
                    title={!isSidebarOpen ? link.label : ""}
                  >
                    <span className="flex-shrink-0">{link.icon}</span>
                    {isSidebarOpen && <span className="text-sm font-medium">{link.label}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* System Section */}
            <div className="px-4 py-6 border-t border-secondary-red mt-auto">
              {isSidebarOpen && (
                <p className="text-xs font-semibold text-white opacity-70 uppercase tracking-wider mb-4">System</p>
              )}
              <div className="space-y-2">
                {groupedNavLinks.system.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                      currentView === link.id ? "bg-secondary-red text-white" : "text-white hover:bg-red-600"
                    }`}
                    title={!isSidebarOpen ? link.label : ""}
                  >
                    <span className="flex-shrink-0">{link.icon}</span>
                    {isSidebarOpen && <span className="text-sm font-medium">{link.label}</span>}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
          <div className="p-6 md:p-8">{renderContent()}</div>
        </main>
      </div>
    </div>
  )
}
