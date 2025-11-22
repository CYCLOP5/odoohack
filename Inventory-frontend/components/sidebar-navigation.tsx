"use client"

import type React from "react"
import { Menu, X, Home, Package, FileText, Truck, Share2, Settings, BarChart3, User } from "lucide-react"

interface NavLink {
  id: string
  label: string
  icon: React.ReactNode
  section: "overview" | "master" | "operations" | "tools" | "reporting" | "system"
}

interface SidebarNavigationProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  currentView: string
  onNavigate: (linkId: string) => void
  onLogout: () => void
  onProfileClick: () => void
}

export function SidebarNavigation({
  isSidebarOpen,
  onToggleSidebar,
  currentView,
  onNavigate,
  onLogout,
  onProfileClick,
}: SidebarNavigationProps) {
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

  const sections = [
    { key: "overview", label: "Overview", links: groupedNavLinks.overview },
    { key: "master", label: "Master Data", links: groupedNavLinks.master },
    { key: "operations", label: "Operations", links: groupedNavLinks.operations },
    { key: "tools", label: "Tools", links: groupedNavLinks.tools },
    { key: "reporting", label: "Reporting", links: groupedNavLinks.reporting },
    { key: "system", label: "System", links: groupedNavLinks.system },
  ]

  const NavLinkButton = ({ link }: { link: NavLink }) => (
    <button
      onClick={() => onNavigate(link.id)}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
        currentView === link.id ? "bg-secondary-red text-white" : "text-white hover:bg-red-600"
      }`}
      title={!isSidebarOpen ? link.label : ""}
    >
      <span className="flex-shrink-0">{link.icon}</span>
      {isSidebarOpen && <span className="text-sm font-medium">{link.label}</span>}
    </button>
  )

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-6 z-40 shadow-sm">
        <button
          onClick={onToggleSidebar}
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
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate("dashboard")}
              className={`text-sm font-medium transition-colors ${
                currentView === "dashboard" ? "text-primary-red" : "text-dark-text hover:text-primary-red"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate("items")}
              className={`text-sm font-medium transition-colors ${
                currentView === "items" ? "text-primary-red" : "text-dark-text hover:text-primary-red"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => onNavigate("reports")}
              className={`text-sm font-medium transition-colors ${
                currentView === "reports" ? "text-primary-red" : "text-dark-text hover:text-primary-red"
              }`}
            >
              Reports
            </button>
          </nav>

          <button
            onClick={onProfileClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-red flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <span className="hidden sm:inline text-sm font-medium text-dark-text">Profile</span>
          </button>
        </div>
      </header>

      {/* Left Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 z-30 bg-primary-red transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-16"
        } border-r border-secondary-red`}
      >
        <nav className="flex flex-col h-full overflow-y-auto">
          {sections.map((section, idx) => (
            <div key={section.key} className={`px-4 py-6 ${idx > 0 ? "border-t border-secondary-red" : ""}`}>
              {isSidebarOpen && (
                <p className="text-xs font-semibold text-white opacity-70 uppercase tracking-wider mb-4">
                  {section.label}
                </p>
              )}
              <div className="space-y-2">
                {section.links.map((link) => (
                  <NavLinkButton key={link.id} link={link} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
