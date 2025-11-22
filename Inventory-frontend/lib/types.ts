export type CurrentPage =
  | "dashboard"
  | "items"
  | "receipts"
  | "deliveries"
  | "transfers"
  | "adjustments"
  | "search"
  | "tags"
  | "workflows"
  | "reports"
  | "settings"
  | "profile"

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  totalStock: number
  reorderMin: number
  price: number
  status: "in-stock" | "low-stock" | "out-of-stock"
  lastUpdated?: string
}

export interface Transaction {
  id: string
  type: "receipt" | "delivery" | "transfer" | "adjustment"
  productId: string
  quantity: number
  status: "draft" | "waiting" | "ready" | "done" | "canceled"
  timestamp: string
}

export interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

export interface UserProfile {
  id: string
  name: string
  email: string
  company?: string
  role?: string
  language: string
  timezone: string
  currency: string
}

export interface AppSettings {
  language: string
  timezone: string
  currency: string
  notifications: boolean
  darkMode: boolean
}
