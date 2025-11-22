"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Product, Transaction, Toast, AppSettings, UserProfile } from "./types"
import { MOCK_PRODUCTS, MOCK_TRANSACTIONS } from "./mock-data"

interface AppContextType {
  products: Product[]
  transactions: Transaction[]
  toasts: Toast[]
  settings: AppSettings
  userProfile: UserProfile
  isLoading: boolean

  // Product operations
  addProduct: (product: Product) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Transaction operations
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void

  // Toast notifications
  showToast: (message: string, type: "success" | "error" | "info") => void
  dismissToast: (id: string) => void

  // Settings
  updateSettings: (updates: Partial<AppSettings>) => void
  updateProfile: (updates: Partial<UserProfile>) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<AppSettings>({
    language: "English",
    timezone: "UTC",
    currency: "USD",
    notifications: true,
    darkMode: false,
  })
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    company: "Tech Corp",
    role: "Inventory Manager",
    language: "English",
    timezone: "UTC",
    currency: "USD",
  })

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [...prev, product])
    showToast("Product added successfully", "success")
  }, [])

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
    showToast("Product updated successfully", "success")
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    showToast("Product deleted successfully", "success")
  }, [])

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction])
  }, [])

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }, [])

  const showToast = useCallback((message: string, type: "success" | "error" | "info") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => dismissToast(id), 3000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }, [])

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }))
  }, [])

  const value: AppContextType = {
    products,
    transactions,
    toasts,
    settings,
    userProfile,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    addTransaction,
    updateTransaction,
    showToast,
    dismissToast,
    updateSettings,
    updateProfile,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within AppProvider")
  }
  return context
}
