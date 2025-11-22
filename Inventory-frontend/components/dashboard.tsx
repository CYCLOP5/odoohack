"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { 
  AlertCircle, 
  CheckCircle, 
  LayoutDashboard, 
  Package, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Truck, 
  Settings, 
  Search, 
  Tags, 
  Workflow, 
  BarChart3, 
  User, 
  LogOut, 
  Menu, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react"
import { 
  getProducts, 
  getAllStock, 
  getMoveHistory, 
  createProduct, 
  deleteProduct, 
  updateProduct,
  updateMoveStatus,
  updateMoveHistoryEntry,
  deleteMoveHistoryEntry,
  createMoveHistory
} from "@/lib/supabase-operations"
import type { Product as DBProduct, StockByLocation, MoveHistory as DBMove } from "@/lib/firestore-types"


// Define interfaces for better type safety
interface Product {
  id: string
  sku: string
  name: string
  category: string
  totalStock: number
  reorderMin: number
  price: string
  description: string
  status: "In Stock" | "Low Stock" | "Critical"
  locations: { location: string; quantity: number }[]
}

interface MoveTransaction {
  id: string
  reference: string
  contact: string // Supplier or Customer
  date: string
  products: { id: string; name: string; quantity: number }[]
  status: "Waiting" | "Done" | "Late"
  type: string // e.g., "Receipt", "Delivery", "Transfer", "Adjustment"
  sourceWarehouse?: string | null
  destinationWarehouse?: string | null
  fromLocation?: string | null
  toLocation?: string | null
  notes?: string | null
}

interface DashboardProps {
  onLogout: () => void | Promise<void>
  initialView?: CurrentPage
  onViewChange?: (view: CurrentPage) => void
}

type CurrentPage =
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

const MOCK_PRODUCTS = [
  {
    id: "1",
    sku: "ELEC-001",
    name: "Monitor",
    category: "Electronic",
    totalStock: 45,
    reorderMin: 50,
    status: "Critical" as const,
    price: "$299.99",
    description: "27-inch 4K Monitor",
    locations: [
      { location: "Main Warehouse", quantity: 20 },
      { location: "North Distribution", quantity: 15 },
      { location: "South Distribution", quantity: 10 },
    ],
  },
  {
    id: "2",
    sku: "TECH-001",
    name: "PC",
    category: "Tech",
    totalStock: 23,
    reorderMin: 20,
    status: "Low Stock" as const,
    price: "$899.99",
    description: "Desktop Computer",
    locations: [
      { location: "Main Warehouse", quantity: 10 },
      { location: "East Fulfillment", quantity: 13 },
    ],
  },
  {
    id: "3",
    sku: "TECH-002",
    name: "RAM",
    category: "Tech",
    totalStock: 82,
    reorderMin: 50,
    status: "Low Stock" as const,
    price: "$79.99",
    description: "16GB DDR4 RAM",
    locations: [
      { location: "Main Warehouse", quantity: 32 },
      { location: "North Distribution", quantity: 50 },
    ],
  },
  {
    id: "4",
    sku: "ELEC-002",
    name: "Keyboard",
    category: "Electronic",
    totalStock: 150,
    reorderMin: 50,
    status: "In Stock" as const,
    price: "$79.99",
    description: "Mechanical Gaming Keyboard",
    locations: [
      { location: "Main Warehouse", quantity: 100 },
      { location: "East Fulfillment", quantity: 50 },
    ],
  },
]

const MOCK_TRANSACTIONS = [
  {
    id: "1",
    reference: "REC-001",
    contact: "Supplier ABC",
    date: "2024-11-20",
    products: [{ id: "1", name: "Monitor", quantity: 10 }],
    status: "Waiting" as const,
    type: "Receipt",
  },
  {
    id: "2",
    reference: "DEL-001",
    contact: "Customer XYZ",
    date: "2024-11-19",
    products: [{ id: "2", name: "PC", quantity: 5 }],
    status: "Done" as const,
    type: "Delivery",
  },
  {
    id: "3",
    reference: "TRF-001",
    contact: "Internal",
    date: "2024-11-21",
    products: [{ id: "3", name: "RAM", quantity: 20 }],
    status: "Waiting" as const,
    type: "Transfer",
  },
]

export default function Dashboard({ onLogout, initialView = "dashboard", onViewChange }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<CurrentPage>(initialView)
  const [products, setProducts] = useState<Product[]>([])
  const [transactions, setTransactions] = useState<MoveTransaction[]>([])
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [editingProductData, setEditingProductData] = useState<Product | null>(null)

  useEffect(() => {
    if (initialView) {
      setCurrentPage(initialView)
    }
  }, [initialView])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [dbProducts, dbStock, dbMoves] = await Promise.all([
        getProducts(),
        getAllStock(),
        getMoveHistory()
      ])

      const uiProducts: Product[] = dbProducts.map(p => {
        const stock = dbStock.filter(s => s.productId === p.id)
        const totalStock = stock.reduce((sum, s) => sum + s.quantity, 0)
        const locations = stock.map(s => ({ location: s.location, quantity: s.quantity }))
        
        let status: "In Stock" | "Low Stock" | "Critical" = "In Stock"
        if (totalStock === 0) status = "Critical"
        else if (totalStock <= p.reorderMin) status = "Low Stock"

        return {
          id: p.id,
          sku: p.sku,
          name: p.name,
          category: p.category,
          totalStock,
          reorderMin: p.reorderMin,
          price: `$${p.price}`,
          description: p.description,
          status,
          locations
        }
      })

      const uiTransactions: MoveTransaction[] = dbMoves.map(m => {
        const product = uiProducts.find(p => p.id === m.productId)
        return {
          id: m.id,
          reference: m.id.substring(0, 8).toUpperCase(),
          contact: m.sourceWarehouse || m.destinationWarehouse || "Unknown",
          date: m.createdAt.toISOString().split('T')[0],
          products: [{ 
            id: m.productId, 
            name: product?.name || "Unknown", 
            quantity: m.quantity 
          }],
          status: m.status as any,
          type: m.type,
          sourceWarehouse: m.sourceWarehouse,
          destinationWarehouse: m.destinationWarehouse,
          fromLocation: m.fromLocation,
          toLocation: m.toLocation,
          notes: m.notes
        }
      })

      setProducts(uiProducts)
      setTransactions(uiTransactions)
    } catch (error) {
      console.error("Failed to load data", error)
    }
  }

  const lowStockProducts = products.filter((p) => p.totalStock <= p.reorderMin)
  const outOfStockProducts = products.filter((p) => p.status === "Critical")
  const highestSaleProduct = products[0] // Assuming this is correct for mock data, may need adjustment for real data
  const pendingReceipts = transactions.filter((t) => t.type === "Receipt" && t.status === "Waiting").length
  const pendingDeliveries = transactions.filter((t) => t.type === "Delivery" && t.status === "Waiting").length
  const lateDeliveries = transactions.filter((t) => t.status === "Late").length

  const handleAddProduct = async (newProduct: Omit<Product, "id">) => {
    try {
      await createProduct({
        sku: newProduct.sku,
        name: newProduct.name,
        category: newProduct.category,
        description: newProduct.description,
        price: parseFloat(newProduct.price.replace('$', '')),
        reorderMin: newProduct.reorderMin,
        status: "active"
      })
      await loadData()
    } catch (error) {
      console.error("Error adding product:", error)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id)
      await loadData()
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const handleUpdateProduct = async (product: Product) => {
    try {
      await updateProduct(product.id, {
        sku: product.sku,
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price.replace('$', ''),
        reorderMin: product.reorderMin,
        status: product.status
      })
      await loadData()
      setEditingProductData(null)
    } catch (error) {
      console.error("Error updating product:", error)
    }
  }

  const handleValidateTransaction = async (id: string) => {
    try {
      await updateMoveStatus(id, "Done")
      await loadData()
    } catch (error) {
      console.error("Error validating transaction:", error)
    }
  }

  const handleCreateTransaction = async (transaction: any) => {
    try {
      await createMoveHistory({
        type: transaction.type,
        status: "Waiting",
        productId: transaction.productId,
        quantity: transaction.quantity,
        fromLocation: transaction.fromLocation || "Unknown",
        toLocation: transaction.toLocation || "Unknown",
        sourceWarehouse: transaction.sourceWarehouse,
        destinationWarehouse: transaction.destinationWarehouse,
        createdBy: "user",
        notes: transaction.notes
      })
      await loadData()
    } catch (error) {
      console.error("Error creating transaction:", error)
    }
  }

  const handleUpdateTransaction = async (id: string, updates: any) => {
    try {
      await updateMoveHistoryEntry(id, updates)
      await loadData()
    } catch (error) {
      console.error("Error updating transaction:", error)
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteMoveHistoryEntry(id)
      await loadData()
    } catch (error) {
      console.error("Error deleting transaction:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await Promise.resolve(onLogout())
    } catch (error) {
      console.error("Logout failed", error)
    } finally {
      setShowLogoutConfirm(false)
    }
  }

  const handlePageChange = (newPage: CurrentPage) => {
    setCurrentPage(newPage)
    if (onViewChange) {
      onViewChange(newPage)
    }
  }

  return (
    <div className="relative h-full overflow-hidden">
      <div className="relative z-10 h-full overflow-auto">
        {currentPage === "dashboard" && (
          <DashboardPage
            products={products}
            lowStockProducts={lowStockProducts}
            outOfStockProducts={outOfStockProducts}
            highestSaleProduct={highestSaleProduct}
            pendingReceipts={pendingReceipts}
            pendingDeliveries={pendingDeliveries}
            lateDeliveries={lateDeliveries}
          />
        )}
        {currentPage === "items" && (
          <ItemsPage 
            products={products} 
            onAddProduct={handleAddProduct} 
            onDeleteProduct={handleDeleteProduct} 
            onUpdateProduct={handleUpdateProduct}
            editingProduct={editingProductData}
            setEditingProduct={setEditingProductData}
          />
        )}
        {currentPage === "receipts" && (
          <ReceiptsPage
            transactions={transactions}
            onValidate={handleValidateTransaction}
            onCreate={handleCreateTransaction}
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
            products={products}
          />
        )}
        {currentPage === "deliveries" && (
          <DeliveriesPage
            transactions={transactions}
            onValidate={handleValidateTransaction}
            onCreate={handleCreateTransaction}
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
            products={products}
          />
        )}
        {currentPage === "transfers" && (
          <TransfersPage
            transactions={transactions}
            onValidate={handleValidateTransaction}
            onCreate={handleCreateTransaction}
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
            products={products}
          />
        )}
        {currentPage === "adjustments" && (
          <AdjustmentsPage
            transactions={transactions}
            onValidate={handleValidateTransaction}
            onCreate={handleCreateTransaction}
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
            products={products}
          />
        )}
        {currentPage === "search" && <SearchPage products={products} />}
        {currentPage === "tags" && <TagsPage />}
        {currentPage === "workflows" && <WorkflowsPage />}
        {currentPage === "reports" && <ReportsPage transactions={transactions} products={products} />}
        {currentPage === "settings" && <SettingsPage />}
        {currentPage === "profile" && <ProfilePage />}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-panel-dark border border-white/10 rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Confirm Logout</h2>
            <p className="text-white/70 mb-2">Do you want to save all your work before logging out?</p>
            <p className="text-sm text-gray-500 mb-6">Any unsaved changes will be lost.</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  alert("Work saved successfully!")
                  handleLogout()
                }}
                className="flex-1 px-4 py-2 bg-[#017E84] text-white rounded-lg hover:bg-[#02a0a8] transition font-semibold"
              >
                Save and Logout
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-[#714B67] text-white rounded-lg hover:bg-[#5a3b52] transition font-semibold"
              >
                Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

function DashboardPage({
  products,
  lowStockProducts,
  outOfStockProducts,
  highestSaleProduct,
  pendingReceipts,
  pendingDeliveries,
  lateDeliveries,
}: any) {
  const panelClass = "glass-panel-dark text-white border border-white/10 p-6"
  const pillClass = "inline-flex items-center gap-2 glass-pill-dark text-xs font-semibold"

  return (
    <div className="p-6 lg:p-10 space-y-8 text-white leading-snug tracking-tight">
      <div>
        <h1 className="text-4xl font-bold">Command Center</h1>
        <p className="text-white/70 mt-2">Real-time inventory overview and metrics</p>
      </div>

      {/* KPI Cards with Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Pending Receipts", value: pendingReceipts, note: "Waiting for validation", accent: "from-[#714B67] to-[#a7749d]" },
          { label: "Pending Deliveries", value: pendingDeliveries, note: "Waiting to be shipped", accent: "from-[#017E84] to-[#39c1c9]" },
          { label: "Low Stock Items", value: products.filter((p: Product) => p.totalStock <= p.reorderMin).length, note: "Need reordering", accent: "from-[#f7b267] to-[#714B67]" },
          { label: "Total Products", value: products.length, note: "Tracked in system", accent: "from-[#8b5cf6] to-[#017E84]" }
        ].map((kpi, idx) => (
          <div key={kpi.label} className={`${panelClass} p-6 shadow-2xl`}> 
            <p className="text-sm text-white/80">{kpi.label}</p>
            <div className="flex items-end justify-between mt-3">
              <p className="text-4xl font-bold text-white">{kpi.value}</p>
              <span className="text-xs text-white/60">#{idx + 1}</span>
            </div>
            <p className="text-xs text-white/60 mt-2">{kpi.note}</p>
            <div className="mt-5 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className={`h-full rounded-full bg-gradient-to-r ${kpi.accent}`} style={{ width: `${80 - idx * 8}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Operational Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "Receipts Status", waiting: pendingReceipts, late: 0, todo: 2 },
          { title: "Deliveries Status", waiting: pendingDeliveries, late: lateDeliveries, todo: 3 }
        ].map((card) => (
          <div key={card.title} className={panelClass}>
            <h3 className="text-lg font-bold mb-4">{card.title}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Waiting</span>
                <span className={`${pillClass} px-3 py-1`}>{card.waiting}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Late</span>
                <span className={`${pillClass} px-3 py-1`}>{card.late}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Queued</span>
                <span className={`${pillClass} px-3 py-1`}>{card.todo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* KPI Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Out of Stock */}
        <div className={panelClass}>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-white">
            <AlertCircle className="w-4 h-4 text-[#fb923c]" />
            Out of Stock Products
          </h3>
          <div className="space-y-2 text-sm max-h-32 overflow-y-auto">
            {outOfStockProducts.length > 0 ? (
              outOfStockProducts.map((p: Product) => (
                <div key={p.id} className="text-white/90 truncate pr-2" title={`${p.name} (${p.category})`}>
                  <strong className="text-sm">{p.name}</strong> <span className="text-xs text-white/60">({p.category})</span>
                </div>
              ))
            ) : (
              <div className="text-white/60">No out of stock products</div>
            )}
          </div>
        </div>

        {/* Highest Sale Product */}
        <div className={panelClass}>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-white">
            <CheckCircle className="w-4 h-4 text-emerald-300" />
            Highest Sale Product
          </h3>
          {highestSaleProduct && (
            <div className="space-y-2 text-sm text-white/90">
              <div className="truncate">
                <strong>Name:</strong> <span className="ml-1">{highestSaleProduct.name}</span>
              </div>
              <div className="truncate">
                <strong>Category:</strong> <span className="ml-1">{highestSaleProduct.category}</span>
              </div>
              <div>
                <strong>Total Units Sold:</strong> <span className="ml-1">156</span>
              </div>
            </div>
          )}
        </div>

        {/* Low Stock Products */}
        <div className={panelClass}>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-white">
            <AlertCircle className="w-4 h-4 text-amber-300" />
            Low Stock Products
          </h3>
          <div className="space-y-2 text-sm max-h-32 overflow-y-auto">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((p: Product) => (
                <div key={p.id} className="text-white/90 truncate pr-2" title={`${p.name} - ${p.totalStock} left (${p.category})`}>
                  <strong className="text-sm">{p.name}</strong> <span className="text-xs">- {p.totalStock} left</span> <span className="text-xs text-white/60">({p.category})</span>
                </div>
              ))
            ) : (
              <div className="text-white/60">No low stock products</div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Warehouse Locations", value: "12" },
          { label: "Product Categories", value: "8" },
          { label: "Total Stock Value", value: "$45.2K" },
          { label: "System Uptime", value: "99.8%" }
        ].map((stat) => (
          <div key={stat.label} className={panelClass}>
            <p className="text-sm text-white/80">{stat.label}</p>
            <p className="text-3xl font-bold mt-2 text-white">{stat.value}</p>
            <div className="mt-4 text-xs text-white/60">Realtime synchronized</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ItemsPage({
  products,
  selectedProduct,
  editingProduct,
  setEditingProduct,
  onSelectProduct,
  onAddProduct,
  onDeleteProduct,
  onUpdateProduct,
}: any) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "Electronic",
    totalStock: 0,
    reorderMin: 0,
    price: "",
    description: "",
  })

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        sku: editingProduct.sku,
        name: editingProduct.name,
        category: editingProduct.category,
        totalStock: editingProduct.totalStock,
        reorderMin: editingProduct.reorderMin,
        price: editingProduct.price.replace('$', ''),
        description: editingProduct.description,
      })
      setShowForm(true)
    }
  }, [editingProduct])

  const handleAddNew = () => {
    if (setEditingProduct) setEditingProduct(null)
    setFormData({
      sku: "",
      name: "",
      category: "Electronic",
      totalStock: 0,
      reorderMin: 0,
      price: "",
      description: "",
    })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProduct && onUpdateProduct) {
      onUpdateProduct({
        ...editingProduct,
        ...formData,
        price: `$${formData.price}`
      })
    } else {
      onAddProduct({
        ...formData,
        status: "In Stock" as const,
        locations: [{ location: "Main Warehouse", quantity: formData.totalStock }],
      })
    }
    setShowForm(false)
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Items</h1>
          <p className="text-white/70 mt-2">Manage inventory items and stock levels</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-[#714B67] text-white px-6 py-2 rounded-lg hover:bg-[#5a3b52] transition font-semibold"
        >
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="glass-panel-dark border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">SKU</label>
                <input
                  type="text"
                  placeholder="e.g. ELEC-001"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Wireless Mouse"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option>Electronic</option>
                  <option>Tech</option>
                  <option>Furniture</option>
                  <option>Office Supplies</option>
                  <option>Peripherals</option>
                  <option>Clothing</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Initial Stock</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.totalStock}
                  onChange={(e) => setFormData({ ...formData, totalStock: Number.parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Min. Reorder Level</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.reorderMin}
                  onChange={(e) => setFormData({ ...formData, reorderMin: Number.parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Price ($)</label>
                <input
                  type="text"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Description</label>
              <textarea
                placeholder="Product description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                rows={3}
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[#017E84] text-white rounded-lg hover:bg-[#02a0a8] transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  if (setEditingProduct) setEditingProduct(null)
                }}
                className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedProduct ? (
        <div className="glass-panel-dark border border-white/10 p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-white">{selectedProduct.name}</h2>
            <button
              onClick={() => {
                onDeleteProduct(selectedProduct.id)
                onSelectProduct(null)
              }}
              className="px-4 py-2 bg-[#714B67] text-white rounded-lg hover:bg-[#5a3b52] transition"
            >
              Delete
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/70 text-sm">SKU</p>
              <p className="text-white font-semibold">{selectedProduct.sku}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm">Category</p>
              <p className="text-white font-semibold">{selectedProduct.category}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm">Total Stock</p>
              <p className="text-white font-semibold">{selectedProduct.totalStock}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm">Reorder Min</p>
              <p className="text-white font-semibold">{selectedProduct.reorderMin}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm">Price</p>
              <p className="text-white font-semibold">{selectedProduct.price}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm">Status</p>
              <p
                className={`font-semibold ${selectedProduct.status === "In Stock"
                  ? "text-green-600"
                  : selectedProduct.status === "Low Stock"
                    ? "text-yellow-600"
                    : "text-red-600"
                  }`}
              >
                {selectedProduct.status}
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectProduct(null)}
            className="mt-6 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition"
          >
            Back
          </button>
        </div>
      ) : (
        <div className="glass-panel-dark border border-white/10 overflow-x-auto">
          <table className="w-full">
            <thead className="glass-panel-dark border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">SKU</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Min</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {products.map((product: Product) => (
                <tr key={product.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-sm text-white">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-white">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-white/70">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-white font-semibold">{product.totalStock}</td>
                  <td className="px-6 py-4 text-sm text-white/70">{product.reorderMin}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${product.status === "In Stock"
                        ? "bg-green-100 text-green-700"
                        : product.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white">{product.price}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="text-red-600 hover:text-red-700 font-semibold"
                    >
                      Edit
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ReceiptsPage({ transactions, onValidate, onCreate, onUpdate, onDelete, products }: any) {
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<MoveTransaction | null>(null)
  const receiptLocationPresets = [
    "Main Warehouse / Stock 1",
    "Main Warehouse / Stock 2",
    "North Distribution / Stock 1"
  ]

  const [formData, setFormData] = useState({
    supplier: "",
    date: "",
    sku: "",
    quantity: 0,
    warehouseLocation: receiptLocationPresets[0],
    customWarehouseLocation: ""
  })

  const resetFormState = () => {
    setFormData({
      supplier: "",
      date: "",
      sku: "",
      quantity: 0,
      warehouseLocation: receiptLocationPresets[0],
      customWarehouseLocation: ""
    })
    setEditingTransaction(null)
    setShowForm(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const product = products?.find((p: any) => p.sku === formData.sku)
    if (!product) {
      alert("Product not found")
      return
    }
    const selectedLocation = formData.warehouseLocation === "custom"
      ? formData.customWarehouseLocation.trim()
      : formData.warehouseLocation

    if (!selectedLocation) {
      alert("Please specify a warehouse location")
      return
    }

    const payload = {
      type: "Receipt",
      productId: product.id,
      quantity: Number(formData.quantity),
      sourceWarehouse: formData.supplier,
      destinationWarehouse: selectedLocation,
      toLocation: selectedLocation,
      notes: `Receipt from ${formData.supplier}`
    }

    if (editingTransaction) {
      onUpdate(editingTransaction.id, payload)
    } else {
      onCreate(payload)
    }
    resetFormState()
  }

  const handleEdit = (transaction: MoveTransaction) => {
    const productId = transaction.products[0]?.id
    const matchedProduct = products?.find((p: any) => p.id === productId)
    const warehouseValue = transaction.toLocation || transaction.destinationWarehouse || receiptLocationPresets[0]
    const isPresetLocation = receiptLocationPresets.includes(warehouseValue ?? "")

    setFormData({
      supplier: transaction.contact,
      date: transaction.date,
      sku: matchedProduct?.sku || "",
      quantity: transaction.products[0]?.quantity || 0,
      warehouseLocation: isPresetLocation ? warehouseValue : "custom",
      customWarehouseLocation: isPresetLocation ? "" : warehouseValue || ""
    })
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  const handleDelete = (transaction: MoveTransaction) => {
    if (window.confirm("Delete this receipt entry?")) {
      onDelete(transaction.id)
      if (editingTransaction?.id === transaction.id) {
        resetFormState()
      }
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Receipts</h1>
          <p className="text-white/70 mt-2">Process and track incoming inventory</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#714B67] text-white px-6 py-2 rounded-lg hover:bg-[#5a3b52] transition font-semibold"
        >
          New Receipt
        </button>
      </div>

      {showForm && (
        <div className="glass-panel-dark border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{editingTransaction ? "Edit Receipt" : "Create New Receipt"}</h2>
            {editingTransaction && (
              <button
                onClick={resetFormState}
                className="text-xs text-white/60 hover:text-white underline"
              >
                Cancel edit
              </button>
            )}
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Supplier Name" 
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                value={formData.supplier}
                onChange={e => setFormData({...formData, supplier: e.target.value})}
                required
              />
              <input 
                type="date" 
                placeholder="Schedule Date" 
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                required
              />
              <input 
                type="text" 
                placeholder="Product SKU" 
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                value={formData.sku}
                onChange={e => setFormData({...formData, sku: e.target.value})}
                required
              />
              <input 
                type="number" 
                placeholder="Quantity" 
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                required
              />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-white/60 uppercase tracking-wide">Warehouse Location</p>
                <p className="text-sm text-white/70">Specify where the stock will be stored (e.g., warehouse/stock 1).</p>
              </div>
              <select
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                value={formData.warehouseLocation}
                onChange={e =>
                  setFormData((prev) => ({
                    ...prev,
                    warehouseLocation: e.target.value,
                    customWarehouseLocation: e.target.value === "custom" ? prev.customWarehouseLocation : ""
                  }))
                }
              >
                {receiptLocationPresets.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
                <option value="custom">Custom location</option>
              </select>
              {formData.warehouseLocation === "custom" && (
                <input
                  type="text"
                  placeholder="Enter custom location (e.g., Warehouse/Stock 1)"
                  className="w-full px-4 py-2 bg-white/10 border border-[#017E84]/40 rounded-lg text-white placeholder:text-white/40"
                  value={formData.customWarehouseLocation}
                  onChange={e => setFormData({ ...formData, customWarehouseLocation: e.target.value })}
                  required
                />
              )}
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[#017E84] text-white rounded-lg hover:bg-[#02a0a8] transition"
              >
                Create
              </button>
              <button
                type="button"
                onClick={resetFormState}
                className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel-dark border border-white/10 overflow-x-auto">
        <table className="w-full">
          <thead className="glass-panel-dark border-b border-white/10">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Reference</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Supplier</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Products</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {transactions.map((transaction: MoveTransaction) => (
              <tr key={transaction.id} className="hover:bg-white/5">
                <td className="px-6 py-4 text-sm text-white font-semibold">{transaction.reference}</td>
                <td className="px-6 py-4 text-sm text-white/70">{transaction.contact}</td>
                <td className="px-6 py-4 text-sm text-white/70">{transaction.date}</td>
                <td className="px-6 py-4 text-sm text-white/70">
                  {transaction.products.map((p) => `${p.name} (${p.quantity})`).join(", ")}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${transaction.status === "Done"
                      ? "bg-green-100 text-green-700"
                      : transaction.status === "Waiting"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    {transaction.status === "Waiting" && (
                      <button
                        onClick={() => onValidate(transaction.id)}
                        className="text-green-400 hover:text-green-200 font-semibold"
                      >
                        Validate
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="text-white/70 hover:text-white font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction)}
                      className="text-red-400 hover:text-red-200 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DeliveriesPage({ transactions, onValidate, onCreate, onUpdate, onDelete, products }: any) {
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<MoveTransaction | null>(null)
  const [formData, setFormData] = useState({
    customer: "",
    date: "",
    sku: "",
    quantity: 0
  })

  const resetFormState = () => {
    setFormData({ customer: "", date: "", sku: "", quantity: 0 })
    setEditingTransaction(null)
    setShowForm(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const product = products?.find((p: any) => p.sku === formData.sku)
    if (!product) {
      alert("Product not found")
      return
    }
    const payload = {
      type: "Delivery",
      productId: product.id,
      quantity: Number(formData.quantity),
      sourceWarehouse: "Main Warehouse",
      destinationWarehouse: formData.customer,
      notes: `Delivery to ${formData.customer}`
    }

    if (editingTransaction) {
      onUpdate(editingTransaction.id, payload)
    } else {
      onCreate(payload)
    }
    resetFormState()
  }

  const handleEdit = (transaction: MoveTransaction) => {
    const productId = transaction.products[0]?.id
    const matchedProduct = products?.find((p: any) => p.id === productId)
    setFormData({
      customer: transaction.contact,
      date: transaction.date,
      sku: matchedProduct?.sku || "",
      quantity: transaction.products[0]?.quantity || 0
    })
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  const handleDelete = (transaction: MoveTransaction) => {
    if (window.confirm("Delete this delivery entry?")) {
      onDelete(transaction.id)
      if (editingTransaction?.id === transaction.id) {
        resetFormState()
      }
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Delivery Orders</h1>
          <p className="text-white/70 mt-2">Manage outgoing shipments and deliveries</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#714B67] text-white px-6 py-2 rounded-lg hover:bg-[#5a3b52] transition font-semibold"
        >
          New Delivery
        </button>
      </div>

      {showForm && (
        <div className="glass-panel-dark border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{editingTransaction ? "Edit Delivery Order" : "Create New Delivery Order"}</h2>
            {editingTransaction && (
              <button onClick={resetFormState} className="text-xs text-white/60 hover:text-white underline">
                Cancel edit
              </button>
            )}
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Customer Name" 
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                value={formData.customer}
                onChange={e => setFormData({...formData, customer: e.target.value})}
                required
              />
              <input 
                type="date" 
                placeholder="Schedule Date" 
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                required
              />
              <input 
                type="text" 
                placeholder="Product SKU" 
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                value={formData.sku}
                onChange={e => setFormData({...formData, sku: e.target.value})}
                required
              />
              <input 
                type="number" 
                placeholder="Quantity" 
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[#017E84] text-white rounded-lg hover:bg-[#02a0a8] transition"
              >
                Create
              </button>
              <button
                type="button"
                onClick={resetFormState}
                className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel-dark border border-white/10 overflow-x-auto">
        <table className="w-full">
          <thead className="glass-panel-dark border-b border-white/10">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Reference</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Products</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {transactions.map((transaction: MoveTransaction) => (
              <tr key={transaction.id} className="hover:bg-white/5">
                <td className="px-6 py-4 text-sm text-white font-semibold">{transaction.reference}</td>
                <td className="px-6 py-4 text-sm text-white/70">{transaction.contact}</td>
                <td className="px-6 py-4 text-sm text-white/70">{transaction.date}</td>
                <td className="px-6 py-4 text-sm text-white/70">
                  {transaction.products.map((p) => `${p.name} (${p.quantity})`).join(", ")}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${transaction.status === "Done"
                      ? "bg-green-100 text-green-700"
                      : transaction.status === "Waiting"
                        ? "bg-red-100 text-red-700"
                        : transaction.status === "Late"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    {transaction.status === "Waiting" && (
                      <button
                        onClick={() => onValidate(transaction.id)}
                        className="text-green-400 hover:text-green-200 font-semibold"
                      >
                        Ship
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="text-white/70 hover:text-white font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction)}
                      className="text-red-400 hover:text-red-200 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TransfersPage({ transactions, onValidate, onCreate, onUpdate, onDelete, products }: any) {
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<MoveTransaction | null>(null)
  const [formData, setFormData] = useState({
    from: "Main Warehouse",
    to: "North Distribution",
    sku: "",
    quantity: 0
  })

  const resetFormState = () => {
    setFormData({ from: "Main Warehouse", to: "North Distribution", sku: "", quantity: 0 })
    setEditingTransaction(null)
    setShowForm(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const product = products?.find((p: any) => p.sku === formData.sku)
    if (!product) {
      alert("Product not found")
      return
    }
    const payload = {
      type: "Transfer",
      productId: product.id,
      quantity: Number(formData.quantity),
      sourceWarehouse: formData.from,
      destinationWarehouse: formData.to,
      fromLocation: formData.from,
      toLocation: formData.to,
      notes: `Transfer from ${formData.from} to ${formData.to}`
    }

    if (editingTransaction) {
      onUpdate(editingTransaction.id, payload)
    } else {
      onCreate(payload)
    }
    resetFormState()
  }

  const handleEdit = (transaction: MoveTransaction) => {
    const productId = transaction.products[0]?.id
    const matchedProduct = products?.find((p: any) => p.id === productId)
    setFormData({
      from: transaction.fromLocation || transaction.contact || "Main Warehouse",
      to: transaction.toLocation || "North Distribution",
      sku: matchedProduct?.sku || "",
      quantity: transaction.products[0]?.quantity || 0
    })
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  const handleDelete = (transaction: MoveTransaction) => {
    if (window.confirm("Delete this transfer entry?")) {
      onDelete(transaction.id)
      if (editingTransaction?.id === transaction.id) {
        resetFormState()
      }
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Internal Transfer</h1>
          <p className="text-white/70 mt-2">Move inventory between warehouse locations</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#714B67] text-white px-6 py-2 rounded-lg hover:bg-[#5a3b52] transition font-semibold"
        >
          New Transfer
        </button>
      </div>

      {showForm && (
        <div className="glass-panel-dark border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{editingTransaction ? "Edit Internal Transfer" : "Create Internal Transfer"}</h2>
            {editingTransaction && (
              <button onClick={resetFormState} className="text-xs text-white/60 hover:text-white underline">
                Cancel edit
              </button>
            )}
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <select 
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                value={formData.from}
                onChange={e => setFormData({...formData, from: e.target.value})}
              >
                <option>Main Warehouse</option>
                <option>North Distribution</option>
              </select>
              <select 
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                value={formData.to}
                onChange={e => setFormData({...formData, to: e.target.value})}
              >
                <option>Main Warehouse</option>
                <option>North Distribution</option>
              </select>
              <input 
                type="text" 
                placeholder="Product SKU" 
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                value={formData.sku}
                onChange={e => setFormData({...formData, sku: e.target.value})}
                required
              />
              <input 
                type="number" 
                placeholder="Quantity" 
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[#017E84] text-white rounded-lg hover:bg-[#02a0a8] transition"
              >
                Create
              </button>
              <button
                type="button"
                onClick={resetFormState}
                className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel-dark border border-white/10 overflow-x-auto">
        <table className="w-full">
          <thead className="glass-panel-dark border-b border-white/10">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Reference</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">From Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">To Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Products</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {transactions.map((transaction: MoveTransaction) => (
              <tr key={transaction.id} className="hover:bg-white/5">
                <td className="px-6 py-4 text-sm text-white font-semibold">{transaction.reference}</td>
                <td className="px-6 py-4 text-sm text-white/70">Main Warehouse</td>
                <td className="px-6 py-4 text-sm text-white/70">North Distribution</td>
                <td className="px-6 py-4 text-sm text-white/70">
                  {transaction.products.map((p) => `${p.name} (${p.quantity})`).join(", ")}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    {transaction.status === "Waiting" && (
                      <button
                        onClick={() => onValidate(transaction.id)}
                        className="text-green-400 hover:text-green-200 font-semibold"
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="text-white/70 hover:text-white font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction)}
                      className="text-red-400 hover:text-red-200 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdjustmentsPage({ transactions, onValidate, onCreate, onUpdate, onDelete, products }: any) {
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<MoveTransaction | null>(null)
  const [formData, setFormData] = useState({
    sku: "",
    currentQty: 0,
    correctQty: 0,
    reason: "Inventory Count",
    notes: ""
  })

  const resetFormState = () => {
    setFormData({ sku: "", currentQty: 0, correctQty: 0, reason: "Inventory Count", notes: "" })
    setEditingTransaction(null)
    setShowForm(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const product = products?.find((p: any) => p.sku === formData.sku)
    if (!product) {
      alert("Product not found")
      return
    }
    const diff = Number(formData.correctQty) - Number(formData.currentQty)
    const payload = {
      type: "Adjustment",
      productId: product.id,
      quantity: Math.abs(diff),
      status: "Done",
      notes: `${formData.reason}: ${formData.notes}`
    }

    if (editingTransaction) {
      onUpdate(editingTransaction.id, payload)
    } else {
      onCreate(payload)
    }
    resetFormState()
  }

  const handleEdit = (transaction: MoveTransaction) => {
    const productId = transaction.products[0]?.id
    const matchedProduct = products?.find((p: any) => p.id === productId)
    setFormData({
      sku: matchedProduct?.sku || "",
      currentQty: 0,
      correctQty: transaction.products[0]?.quantity || 0,
      reason: (transaction.notes?.split(":")[0] || "Inventory Count") as any,
      notes: transaction.notes?.split(":").slice(1).join(":").trim() || ""
    })
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  const handleDelete = (transaction: MoveTransaction) => {
    if (window.confirm("Delete this adjustment entry?")) {
      onDelete(transaction.id)
      if (editingTransaction?.id === transaction.id) {
        resetFormState()
      }
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Inventory Adjustments</h1>
          <p className="text-white/70 mt-2">Correct stock counts and manage discrepancies</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#714B67] text-white px-6 py-2 rounded-lg hover:bg-[#5a3b52] transition font-semibold"
        >
          New Adjustment
        </button>
      </div>

      {showForm && (
        <div className="glass-panel-dark border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{editingTransaction ? "Edit Inventory Adjustment" : "Create Inventory Adjustment"}</h2>
            {editingTransaction && (
              <button onClick={resetFormState} className="text-xs text-white/60 hover:text-white underline">
                Cancel edit
              </button>
            )}
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Product SKU</label>
                <input 
                  type="text" 
                  placeholder="Product SKU" 
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                  value={formData.sku}
                  onChange={e => setFormData({...formData, sku: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Current Quantity</label>
                <input
                  type="number"
                  placeholder="Current Quantity"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                  value={formData.currentQty}
                  onChange={e => setFormData({...formData, currentQty: Number(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Correct Quantity</label>
                <input
                  type="number"
                  placeholder="Correct Quantity"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                  value={formData.correctQty}
                  onChange={e => setFormData({...formData, correctQty: Number(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Reason</label>
                <select 
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                >
                  <option>Inventory Count</option>
                  <option>Damage</option>
                  <option>Theft</option>
                  <option>Expiry</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Notes</label>
              <textarea 
                placeholder="Notes" 
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40" 
                rows={3} 
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[#017E84] text-white rounded-lg hover:bg-[#02a0a8] transition"
              >
                Create
              </button>
              <button
                type="button"
                onClick={resetFormState}
                className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel-dark border border-white/10 overflow-x-auto">
        <table className="w-full">
          <thead className="glass-panel-dark border-b border-white/10">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Reference</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Product</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Old Qty</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">New Qty</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Reason</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {transactions.map((transaction: MoveTransaction) => (
              <tr key={transaction.id} className="hover:bg-white/5">
                <td className="px-6 py-4 text-sm text-white font-semibold">{transaction.reference}</td>
                <td className="px-6 py-4 text-sm text-white/70">
                  {transaction.products.map((p) => p.name).join(", ")}
                </td>
                <td className="px-6 py-4 text-sm text-white/70">100</td>
                <td className="px-6 py-4 text-sm text-white/70">{transaction.products[0]?.quantity || 0}</td>
                <td className="px-6 py-4 text-sm text-white/70">Inventory Count</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-700">
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SearchPage({ products }: any) {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setResults(
        products.filter(
          (p: Product) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.sku.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()),
        ),
      )
    } else {
      setResults([])
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Search</h1>
        <p className="text-white/70 mt-2">Search for products by name, SKU, or category</p>
      </div>

      <div className="glass-panel-dark border border-white/10 p-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-red-600"
        />
      </div>

      {results.length > 0 && (
        <div className="glass-panel-dark border border-white/10 overflow-x-auto">
          <table className="w-full">
            <thead className="glass-panel-dark border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">SKU</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {results.map((product: Product) => (
                <tr key={product.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-sm text-white">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-white">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-white/70">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-white font-semibold">{product.totalStock}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${product.status === "In Stock"
                        ? "bg-green-100 text-green-700"
                        : product.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {searchQuery && results.length === 0 && (
        <div className="glass-panel-dark border border-white/10 p-12 text-center">
          <p className="text-white/70">No products found matching your search</p>
        </div>
      )}
    </div>
  )
}

function TagsPage() {
  const [tags, setTags] = useState([
    { id: 1, name: "Fragile", color: "red" },
    { id: 2, name: "Perishable", color: "orange" },
    { id: 3, name: "High Value", color: "purple" },
  ])
  const [newTag, setNewTag] = useState("")

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTag.trim()) {
      setTags([
        ...tags,
        {
          id: Math.max(...tags.map((t) => t.id), 0) + 1,
          name: newTag,
          color: "blue",
        },
      ])
      setNewTag("")
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Tags</h1>
        <p className="text-white/70 mt-2">Create and manage custom tags for inventory</p>
      </div>

      <div className="glass-panel-dark border border-white/10 p-6">
        <h2 className="text-lg font-bold text-white mb-4">Create New Tag</h2>
        <form onSubmit={handleAddTag} className="flex gap-4">
          <input
            type="text"
            placeholder="Tag name"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
          />
          <button type="submit" className="px-6 py-2 bg-[#017E84] text-white rounded-lg hover:bg-[#02a0a8] transition">
            Add
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tags.map((tag) => (
          <div key={tag.id} className="glass-panel-dark border border-white/10 p-4">
            <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold bg-${tag.color}-500`}>
              {tag.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WorkflowsPage() {
  const workflows = [
    { id: 1, name: "New Receipt", status: "Active", steps: 3 },
    { id: 2, name: "Delivery Process", status: "Active", steps: 4 },
    { id: 3, name: "Stock Transfer", status: "Inactive", steps: 2 },
  ]

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Workflows</h1>
        <p className="text-white/70 mt-2">Manage inventory workflows and processes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="glass-panel-dark border border-white/10 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white">{workflow.name}</h3>
                <p className="text-sm text-white/70 mt-1">Steps: {workflow.steps}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${workflow.status === "Active" ? "bg-green-100 text-green-700" : "bg-white/20 text-white/80"
                  }`}
              >
                {workflow.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportsPage({ transactions, products }: any) {
  const [reportType, setReportType] = useState("inventory")

  const totalStock = products.reduce((sum: number, p: Product) => sum + p.totalStock, 0)
  const lowStockCount = products.filter((p: Product) => p.totalStock <= p.reorderMin).length
  const completedTransactions = transactions.filter((t: MoveTransaction) => t.status === "Done").length
  const totalTransactions = transactions.length

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Reports</h1>
        <p className="text-white/70 mt-2">Generate and view comprehensive inventory reports</p>
      </div>

      <div className="glass-panel-dark border border-white/10 p-6">
        <label className="block text-sm font-semibold text-white mb-3">Select Report Type</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 w-full md:w-64"
        >
          <option value="inventory">Inventory Summary</option>
          <option value="transactions">Transaction History</option>
          <option value="stock">Stock by Category</option>
          <option value="movements">Stock Movements</option>
        </select>
      </div>

      {reportType === "inventory" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel-dark border border-white/10 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Inventory Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-white/70">Total Products</span>
                <span className="font-semibold text-white">{products.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Total Stock</span>
                <span className="font-semibold text-white">{totalStock} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Low Stock Items</span>
                <span className="font-semibold text-yellow-600">{lowStockCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Out of Stock</span>
                <span className="font-semibold text-red-600">
                  {products.filter((p: Product) => p.status === "Critical").length}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-panel-dark border border-white/10 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Transaction Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-white/70">Total Transactions</span>
                <span className="font-semibold text-white">{totalTransactions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Completed</span>
                <span className="font-semibold text-green-600">{completedTransactions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Pending</span>
                <span className="font-semibold text-red-600">
                  {transactions.filter((t: MoveTransaction) => t.status === "Waiting").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Late</span>
                <span className="font-semibold text-orange-600">
                  {transactions.filter((t: MoveTransaction) => t.status === "Late").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === "transactions" && (
        <div className="glass-panel-dark border border-white/10 overflow-x-auto">
          <table className="w-full">
            <thead className="glass-panel-dark border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Reference</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {transactions.map((t: MoveTransaction) => (
                <tr key={t.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-sm text-white">{t.reference}</td>
                  <td className="px-6 py-4 text-sm text-white/70">{t.type}</td>
                  <td className="px-6 py-4 text-sm text-white/70">{t.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${t.status === "Done"
                        ? "bg-green-100 text-green-700"
                        : t.status === "Waiting"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reportType === "stock" && (
        <div className="glass-panel-dark border border-white/10 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Stock by Category</h3>
          <div className="space-y-4">
            {["Electronic", "Tech", "Furniture", "Clothing"].map((category) => {
              const categoryStock = products
                .filter((p: Product) => p.category === category)
                .reduce((sum: number, p: Product) => sum + p.totalStock, 0)
              return (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-white/80 font-medium">{category}</span>
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#714B67] h-2 rounded-full"
                      style={{ width: `${(categoryStock / totalStock) * 100}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold">{categoryStock} units</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function SettingsPage() {
  const [settings, setSettings] = useState({
    language: "English",
    timezone: "UTC",
    theme: "Light",
    emailNotifications: true,
    stockAlerts: true,
    currency: "USD",
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value })
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-white/70 mt-2">Manage your account and system preferences</p>
      </div>

      {/* Account Settings */}
      <div className="glass-panel-dark border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Account Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
            <input
              type="email"
              value="john.doe@odooinventoryiq.com"
              readOnly
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Full Name</label>
            <input type="text" defaultValue="John Doe" className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Company Name</label>
            <input
              type="text"
              defaultValue="Tech Solutions Inc."
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-panel-dark border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange("language", e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange("timezone", e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
            >
              <option>UTC</option>
              <option>EST</option>
              <option>CST</option>
              <option>PST</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange("currency", e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>JPY</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-panel-dark border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-white">Email Notifications</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.stockAlerts}
              onChange={(e) => handleSettingChange("stockAlerts", e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-white">Low Stock Alerts</span>
          </label>
        </div>
      </div>

      <button className="px-6 py-2 bg-[#714B67] text-white rounded-lg hover:bg-[#5a3b52] transition font-semibold">
        Save Settings
      </button>
    </div>
  )
}

function ProfilePage() {
  const [editMode, setEditMode] = useState(false)
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john.doe@odooinventoryiq.com",
    phone: "+1-555-0123",
    department: "Operations Manager",
    company: "Tech Solutions Inc.",
    location: "New York, USA",
    role: "Warehouse Manager",
    joinDate: "January 15, 2023",
  })

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="text-white/70 mt-2">Manage your personal and professional information</p>
      </div>

      <div className="glass-panel-dark border border-white/10 p-8">
        {/* Profile Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex gap-6 items-start">
            <div className="w-24 h-24 bg-[#714B67] rounded-full flex items-center justify-center text-white text-2xl font-bold">
              JD
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{profile.fullName}</h2>
              <p className="text-white/70">{profile.role}</p>
              <p className="text-white/70 text-sm mt-2">{profile.department}</p>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-6 py-2 rounded-lg font-semibold transition ${editMode ? "bg-gray-200 text-white hover:bg-gray-300" : "bg-[#714B67] text-white hover:bg-[#5a3b52]"
              }`}
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-1">Full Name</label>
              {editMode ? (
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                />
              ) : (
                <p className="text-white font-medium">{profile.fullName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-1">Email</label>
              <p className="text-white">{profile.email}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-1">Phone</label>
              {editMode ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
                />
              ) : (
                <p className="text-white">{profile.phone}</p>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Professional Information</h3>
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-1">Role</label>
              <p className="text-white font-medium">{profile.role}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-1">Department</label>
              <p className="text-white">{profile.department}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-1">Company</label>
              <p className="text-white">{profile.company}</p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-bold text-white mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-1">Location</label>
                <p className="text-white">{profile.location}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-1">Join Date</label>
                <p className="text-white">{profile.joinDate}</p>
              </div>
            </div>
          </div>
        </div>

        {editMode && (
          <div className="mt-8 pt-8 border-t border-gray-200 flex gap-4">
            <button className="px-6 py-2 bg-[#017E84] text-white rounded-lg hover:bg-[#02a0a8] transition font-semibold">
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Account Security */}
      <div className="glass-panel-dark border border-white/10 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Account Security</h3>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-white/5 transition">
            Change Password
          </button>
          <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-white/5 transition">
            Two-Factor Authentication
          </button>
          <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-white/5 transition">
            Active Sessions
          </button>
        </div>
      </div>
    </div>
  )
}
