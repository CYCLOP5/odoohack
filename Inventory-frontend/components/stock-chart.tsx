"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function StockChart() {
  const categoryData = [
    { category: "Electronics", value: 320, percentage: 25.6 },
    { category: "Textiles", value: 240, percentage: 19.2 },
    { category: "Furniture", value: 280, percentage: 22.4 },
    { category: "Food & Beverage", value: 190, percentage: 15.2 },
    { category: "Office Supplies", value: 170, percentage: 13.6 },
  ]

  // Using CSS variables for colors would be ideal, but Recharts needs hex/rgb strings.
  // We can use a hook or just hardcode theme-compatible colors for now.
  // Assuming a blue/primary theme.
  const COLORS = ["#2563eb", "#0ea5e9", "#3b82f6", "#60a5fa", "#93c5fd"]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Pie Chart */}
      <div className="flex justify-center items-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ category, percentage }) => `${category} (${percentage}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value) => `${value} units`} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis 
              dataKey="category" 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
              angle={-45} 
              textAnchor="end" 
              height={80} 
              stroke="hsl(var(--border))"
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              stroke="hsl(var(--border))"
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value) => `${value} units`} 
            />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
