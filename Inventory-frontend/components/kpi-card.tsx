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
    blue: "bg-blue-100 text-blue-600 border-blue-200",
    coral: "bg-red-100 text-red-600 border-red-200",
  }

  const bgColor = color === "blue" ? "bg-blue-50" : "bg-red-50"
  const borderColor = color === "blue" ? "border-blue-200" : "border-red-200"

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>{icon}</div>
        {isAlert && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">Alert</span>}
      </div>

      <h3 className="text-sm text-slate-600 mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-slate-900">{value.toLocaleString()}</p>
        <p className={`text-xs font-semibold ${color === "blue" ? "text-green-600" : "text-green-600"}`}>{trend}</p>
      </div>
    </div>
  )
}
