import type { ReactNode } from "react"

interface KPICardProps {
  title: string
  value: number
  icon: ReactNode
  color: "blue" | "coral"
  trend: string
  isAlert?: boolean
}

export default function KPICard({ title, value, icon, color, trend, isAlert = false }: KPICardProps) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    coral: "bg-destructive/10 text-destructive border-destructive/20",
  }

  const cardClasses = color === "blue" 
    ? "glass-card border-blue-500/20 hover:border-blue-500/40" 
    : "glass-card border-destructive/20 hover:border-destructive/40"

  return (
    <div className={`${cardClasses} border rounded-lg p-6 hover:shadow-md transition-all duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${colorClasses[color]}`}>{icon}</div>
        {isAlert && <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs font-semibold rounded border border-destructive/20">Alert</span>}
      </div>

      <h3 className="text-sm text-muted-foreground mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-foreground">{value.toLocaleString()}</p>
        <p className="text-xs font-semibold text-green-500">{trend}</p>
      </div>
    </div>
  )
}
