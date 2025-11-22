// Data models and TypeScript interfaces for Firestore collections

export interface Product {
  id: string
  sku: string
  name: string
  category: string
  description: string
  price: number
  reorderMin: number
  createdAt: Date
  updatedAt: Date
  status: "active" | "inactive" | "discontinued"
}

export interface StockByLocation {
  productId: string
  location: string
  quantity: number
  lastUpdated: Date
  warehouseId: string
}

export interface MoveHistory {
  id: string
  type: "Receipt" | "Delivery" | "Transfer" | "Adjustment"
  status: "Draft" | "Waiting" | "Ready" | "Done" | "Canceled"
  productId: string
  quantity: number
  fromLocation: string
  toLocation: string
  sourceWarehouse?: string
  destinationWarehouse?: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  notes?: string
}

export interface Category {
  id: string
  name: string
  description?: string
  createdAt: Date
}

export interface Warehouse {
  id: string
  name: string
  location: string
  capacity: number
  currentUtilization: number
  status: "active" | "inactive"
  createdAt: Date
}

export interface User {
  uid: string
  email: string
  displayName: string
  role: "admin" | "manager" | "staff"
  warehouseAccess: string[]
  createdAt: Date
}

export interface Dashboard {
  totalProductsInStock: number
  lowStockItems: number
  pendingReceipts: number
  pendingDeliveries: number
  lastUpdated: Date
}
