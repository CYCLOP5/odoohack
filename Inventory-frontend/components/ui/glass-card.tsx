import React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
}

export function GlassCard({ children, className, hoverEffect = true, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-6 transition-all duration-300 border border-white/50 shadow-sm",
        hoverEffect && "hover:shadow-lg hover:bg-white/80 hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
