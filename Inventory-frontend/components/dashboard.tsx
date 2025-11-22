"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"

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
}

interface DashboardProps {
  onLogout: () => void
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [transactions, setTransactions] = useState<MoveTransaction[]>(MOCK_TRANSACTIONS)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [editingProductData, setEditingProductData] = useState<Product | null>(null)

  const lowStockProducts = products.filter((p) => p.totalStock <= p.reorderMin)
  const outOfStockProducts = products.filter((p) => p.status === "Critical")
  const highestSaleProduct = products[0] // Assuming this is correct for mock data, may need adjustment for real data
  const pendingReceipts = transactions.filter((t) => t.type === "Receipt" && t.status === "Waiting").length
  const pendingDeliveries = transactions.filter((t) => t.type === "Delivery" && t.status === "Waiting").length
  const lateDeliveries = transactions.filter((t) => t.status === "Late").length

  const handleAddProduct = (newProduct: Omit<Product, "id">) => {
    const product: Product = {
      ...newProduct,
      id: String(Math.max(...products.map((p) => Number.parseInt(p.id)), 0) + 1),
    }
    setProducts([...products, product])
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const handleValidateTransaction = (id: string) => {
    setTransactions(transactions.map((t) => (t.id === id ? { ...t, status: "Done" as const } : t)))
  }

  const handleLogout = () => {
    setShowLogoutConfirm(false)
    onLogout()
  }

  const handlePageChange = (newPage: CurrentPage) => {
    setCurrentPage(newPage)
    if (onViewChange) {
      onViewChange(newPage)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Complete Red Sidebar shit is here */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-red-600 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-red-700">
          {sidebarOpen && <h1 className="text-xl font-bold">StockMaster</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-red-700 p-2 rounded">
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Overview */}
          <div>
            {sidebarOpen && <h3 className="text-xs font-semibold text-red-200 uppercase px-2 mb-3">Overview</h3>}
            <button
              onClick={() => handlePageChange("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded transition ${currentPage === "dashboard" ? "bg-red-700" : "hover:bg-red-500"
                }`}
            >
              <span>📊</span>
              {sidebarOpen && <span>Dashboard</span>}
            </button>
          </div>

          {/* Master Data */}
          <div>
            {sidebarOpen && <h3 className="text-xs font-semibold text-red-200 uppercase px-2 mb-3">Master Data</h3>}
            <button
              onClick={() => handlePageChange("items")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded transition ${currentPage === "items" ? "bg-red-700" : "hover:bg-red-500"
                }`}
            >
              <span>📦</span>
              {sidebarOpen && <span>Items</span>}
            </button>
          </div>

          {/* Operations */}
          <div>
            {sidebarOpen && <h3 className="text-xs font-semibold text-red-200 uppercase px-2 mb-3">Operations</h3>}
            <div className="space-y-2">
              <button
                onClick={() => handlePageChange("receipts")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition ${currentPage === "receipts" ? "bg-red-700" : "hover:bg-red-500"
                  }`}
              >
                <span>📥</span>
                {sidebarOpen && <span>Receipts</span>}
              </button>
              <button
                onClick={() => handlePageChange("deliveries")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition ${currentPage === "deliveries" ? "bg-red-700" : "hover:bg-red-500"
                  }`}
              >
                <span>📤</span>
                {sidebarOpen && <span>Deliveries</span>}
              </button>
              <button
                onClick={() => handlePageChange("transfers")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition ${currentPage === "transfers" ? "bg-red-700" : "hover:bg-red-500"
                  }`}
              >
                <span>🚚</span>
                {sidebarOpen && <span>Transfers</span>}
              </button>
              <button
                onClick={() => handlePageChange("adjustments")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition ${currentPage === "adjustments" ? "bg-red-700" : "hover:bg-red-500"
                  }`}
              >
                <span>⚙️</span>
                {sidebarOpen && <span>Adjustments</span>}
              </button>
            </div>
          </div>

          {/* Other Tools */}
          <div>
            {sidebarOpen && <h3 className="text-xs font-semibold text-red-200 uppercase px-2 mb-3">Tools</h3>}
            <div className="space-y-2">
              <button
                onClick={() => handlePageChange("search")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition ${currentPage === "search" ? "bg-red-700" : "hover:bg-red-500"
                  }`}
              >
                <span>🔍</span>
                {sidebarOpen && <span>Search</span>}
              </button>
              <button
                onClick={() => handlePageChange("tags")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition ${currentPage === "tags" ? "bg-red-700" : "hover:bg-red-500"
                  }`}
              >
                <span>🏷️</span>
                {sidebarOpen && <span>Tags</span>}
              </button>
              <button
                onClick={() => handlePageChange("workflows")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition ${currentPage === "workflows" ? "bg-red-700" : "hover:bg-red-500"
                  }`}
              >
                <span>⚡</span>
                {sidebarOpen && <span>Workflows</span>}
              </button>
            </div>
          </div>

          {/* Reporting */}
          <div>
            {sidebarOpen && <h3 className="text-xs font-semibold text-red-200 uppercase px-2 mb-3">Reporting</h3>}
            <button
              onClick={() => handlePageChange("reports")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded transition ${currentPage === "reports" ? "bg-red-700" : "hover:bg-red-500"
                }`}
            >
              <span>📈</span>
              {sidebarOpen && <span>Reports</span>}
            </button>
          </div>

          {/* System */}
          <div>
            {sidebarOpen && <h3 className="text-xs font-semibold text-red-200 uppercase px-2 mb-3">System</h3>}
            <button
              onClick={() => handlePageChange("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded transition ${currentPage === "settings" ? "bg-red-700" : "hover:bg-red-500"
                }`}
            >
              <span>⚙️</span>
              {sidebarOpen && <span>Settings</span>}
            </button>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-red-700 p-4 space-y-2">
          <button
            onClick={() => handlePageChange("profile")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition ${currentPage === "profile" ? "bg-red-700" : "hover:bg-red-500"
              }`}
          >
            <span>👤</span>
            {sidebarOpen && <span>Profile</span>}
          </button>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-red-500 transition text-red-100"
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content- Complete Dashboard shit is here */}
      <div className="flex-1 overflow-auto">
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
          <ItemsPage products={products} onAddProduct={handleAddProduct} onDeleteProduct={handleDeleteProduct} />
        )}
        {currentPage === "receipts" && (
          <ReceiptsPage transactions={transactions} onValidate={handleValidateTransaction} />
        )}
        {currentPage === "deliveries" && (
          <DeliveriesPage transactions={transactions} onValidate={handleValidateTransaction} />
        )}
        {currentPage === "transfers" && (
          <TransfersPage transactions={transactions} onValidate={handleValidateTransaction} />
        )}
        {currentPage === "adjustments" && (
          <AdjustmentsPage transactions={transactions} onValidate={handleValidateTransaction} />
        )}
        {currentPage === "search" && <SearchPage products={products} />}
        {currentPage === "tags" && <TagsPage />}
        {currentPage === "workflows" && <WorkflowsPage />}
        {currentPage === "reports" && <ReportsPage transactions={transactions} products={products} />}
        {currentPage === "settings" && <SettingsPage />}
        {currentPage === "profile" && <ProfilePage />}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-2">Do you want to save all your work before logging out?</p>
            <p className="text-sm text-gray-500 mb-6">Any unsaved changes will be lost.</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  alert("Work saved successfully!")
                  handleLogout()
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Save and Logout
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Real-time inventory overview and metrics</p>
      </div>

      {/* KPI Cards with Colors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border-2 border-red-600 p-6 shadow-sm">
          <p className="text-sm text-red-700 font-semibold">Pending Receipts</p>
          <p className="text-4xl font-bold text-red-600 mt-2">{pendingReceipts}</p>
          <p className="text-xs text-red-600 mt-2">Waiting for validation</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-600 p-6 shadow-sm">
          <p className="text-sm text-blue-700 font-semibold">Pending Deliveries</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{pendingDeliveries}</p>
          <p className="text-xs text-blue-600 mt-2">Waiting to be shipped</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-500 p-6 shadow-sm">
          <p className="text-sm text-yellow-700 font-semibold">Low Stock Items</p>
          <p className="text-4xl font-bold text-yellow-600 mt-2">
            {products.filter((p: Product) => p.totalStock <= p.reorderMin).length}
          </p>
          <p className="text-xs text-yellow-600 mt-2">Need reordering</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-600 p-6 shadow-sm">
          <p className="text-sm text-green-700 font-semibold">Total Products</p>
          <p className="text-4xl font-bold text-green-600 mt-2">{products.length}</p>
          <p className="text-xs text-green-600 mt-2">In system</p>
        </div>
      </div>

      {/* Operational Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Receipts Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Waiting</span>
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">{pendingReceipts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Late</span>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">To Receive</span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">2</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Deliveries Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Waiting</span>
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">{pendingDeliveries}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Late</span>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">
                {lateDeliveries}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">To Deliver</span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Out of Stock */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-gray-600 text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            Out of Stock Products
          </h3>
          <div className="space-y-2">
            {outOfStockProducts.length > 0 ? (
              outOfStockProducts.map((p: Product) => (
                <div key={p.id} className="text-sm text-gray-700">
                  <strong>{p.name}</strong> <span className="text-gray-500">({p.category})</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No out of stock products</div>
            )}
          </div>
        </div>

        {/* Highest Sale Product */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-gray-600 text-sm font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Highest Sale Product
          </h3>
          {highestSaleProduct && (
            <div className="space-y-2 text-sm">
              <div>
                <strong>Name:</strong> {highestSaleProduct.name}
              </div>
              <div>
                <strong>Category:</strong> {highestSaleProduct.category}
              </div>
              <div>
                <strong>Total Units Sold:</strong> 156
              </div>
            </div>
          )}
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-gray-600 text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            Low Stock Products
          </h3>
          <div className="space-y-2">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((p: Product) => (
                <div key={p.id} className="text-sm text-gray-700">
                  <strong>{p.name}</strong> - {p.totalStock} left <span className="text-gray-500">({p.category})</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No low stock products</div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Total Warehouse Locations</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Product Categories</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Total Stock Value</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">$45.2K</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600">System Uptime</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">99.8%</p>
        </div>
      </div>
    </div>
  )
}

function ItemsPage({
  products,
  selectedProduct,
  editingProduct,
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

  const handleAddNew = () => {
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
    onAddProduct({
      ...formData,
      status: "In Stock" as const,
      locations: [{ location: "Main Warehouse", quantity: formData.totalStock }],
    })
    setShowForm(false)
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Items</h1>
          <p className="text-gray-600 mt-2">Manage inventory items and stock levels</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
        >
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option>Electronic</option>
                <option>Tech</option>
                <option>Furniture</option>
                <option>Clothing</option>
              </select>
              <input
                type="number"
                placeholder="Total Stock"
                value={formData.totalStock}
                onChange={(e) => setFormData({ ...formData, totalStock: Number.parseInt(e.target.value) })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="number"
                placeholder="Reorder Min"
                value={formData.reorderMin}
                onChange={(e) => setFormData({ ...formData, reorderMin: Number.parseInt(e.target.value) })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedProduct ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
            <button
              onClick={() => {
                onDeleteProduct(selectedProduct.id)
                onSelectProduct(null)
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">SKU</p>
              <p className="text-gray-900 font-semibold">{selectedProduct.sku}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Category</p>
              <p className="text-gray-900 font-semibold">{selectedProduct.category}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Stock</p>
              <p className="text-gray-900 font-semibold">{selectedProduct.totalStock}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Reorder Min</p>
              <p className="text-gray-900 font-semibold">{selectedProduct.reorderMin}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Price</p>
              <p className="text-gray-900 font-semibold">{selectedProduct.price}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Status</p>
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
            className="mt-6 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
          >
            Back
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SKU</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Min</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product: Product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{product.totalStock}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.reorderMin}</td>
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
                  <td className="px-6 py-4 text-sm text-gray-900">{product.price}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => setEditingProductData(product)}
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

function ReceiptsPage({ transactions, onValidate }: any) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Receipts</h1>
          <p className="text-gray-600 mt-2">Process and track incoming inventory</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
        >
          New Receipt
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Receipt</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Supplier Name" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="date" placeholder="Schedule Date" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="Product SKU" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="number" placeholder="Quantity" className="px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reference</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Supplier</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Products</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction: MoveTransaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{transaction.reference}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{transaction.contact}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{transaction.date}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
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
                  {transaction.status === "Waiting" && (
                    <button
                      onClick={() => onValidate(transaction.id)}
                      className="text-green-600 hover:text-green-700 font-semibold"
                    >
                      Validate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DeliveriesPage({ transactions, onValidate }: any) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Delivery Orders</h1>
          <p className="text-gray-600 mt-2">Manage outgoing shipments and deliveries</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
        >
          New Delivery
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Delivery Order</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Customer Name" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="date" placeholder="Schedule Date" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="Product SKU" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="number" placeholder="Quantity" className="px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reference</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Products</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction: MoveTransaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{transaction.reference}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{transaction.contact}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{transaction.date}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
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
                  {transaction.status === "Waiting" && (
                    <button
                      onClick={() => onValidate(transaction.id)}
                      className="text-green-600 hover:text-green-700 font-semibold"
                    >
                      Ship
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TransfersPage({ transactions, onValidate }: any) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Internal Transfer</h1>
          <p className="text-gray-600 mt-2">Move inventory between warehouse locations</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
        >
          New Transfer
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create Internal Transfer</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>From: Main Warehouse</option>
                <option>From: North Distribution</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>To: Main Warehouse</option>
                <option>To: North Distribution</option>
              </select>
              <input type="text" placeholder="Product SKU" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="number" placeholder="Quantity" className="px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reference</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">From Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">To Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Products</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction: MoveTransaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{transaction.reference}</td>
                <td className="px-6 py-4 text-sm text-gray-600">Main Warehouse</td>
                <td className="px-6 py-4 text-sm text-gray-600">North Distribution</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {transaction.products.map((p) => `${p.name} (${p.quantity})`).join(", ")}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {transaction.status === "Waiting" && (
                    <button
                      onClick={() => onValidate(transaction.id)}
                      className="text-green-600 hover:text-green-700 font-semibold"
                    >
                      Confirm
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdjustmentsPage({ transactions, onValidate }: any) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Adjustments</h1>
          <p className="text-gray-600 mt-2">Correct stock counts and manage discrepancies</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
        >
          New Adjustment
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create Inventory Adjustment</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Product SKU" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input
                type="number"
                placeholder="Current Quantity"
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Correct Quantity"
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>Reason: Inventory Count</option>
                <option>Reason: Damage</option>
                <option>Reason: Theft</option>
                <option>Reason: Expiry</option>
              </select>
            </div>
            <textarea placeholder="Notes" className="w-full px-4 py-2 border border-gray-300 rounded-lg" rows={3} />
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reference</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Old Qty</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">New Qty</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reason</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction: MoveTransaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{transaction.reference}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {transaction.products.map((p) => p.name).join(", ")}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">100</td>
                <td className="px-6 py-4 text-sm text-gray-600">{transaction.products[0]?.quantity || 0}</td>
                <td className="px-6 py-4 text-sm text-gray-600">Inventory Count</td>
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
        <h1 className="text-3xl font-bold text-gray-900">Search</h1>
        <p className="text-gray-600 mt-2">Search for products by name, SKU, or category</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
        />
      </div>

      {results.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SKU</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((product: Product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{product.totalStock}</td>
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
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No products found matching your search</p>
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
        <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
        <p className="text-gray-600 mt-2">Create and manage custom tags for inventory</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Create New Tag</h2>
        <form onSubmit={handleAddTag} className="flex gap-4">
          <input
            type="text"
            placeholder="Tag name"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            Add
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tags.map((tag) => (
          <div key={tag.id} className="bg-white rounded-lg border border-gray-200 p-4">
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
        <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
        <p className="text-gray-600 mt-2">Manage inventory workflows and processes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{workflow.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Steps: {workflow.steps}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${workflow.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
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
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-2">Generate and view comprehensive inventory reports</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">Select Report Type</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-64"
        >
          <option value="inventory">Inventory Summary</option>
          <option value="transactions">Transaction History</option>
          <option value="stock">Stock by Category</option>
          <option value="movements">Stock Movements</option>
        </select>
      </div>

      {reportType === "inventory" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Inventory Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Products</span>
                <span className="font-semibold text-gray-900">{products.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Stock</span>
                <span className="font-semibold text-gray-900">{totalStock} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Low Stock Items</span>
                <span className="font-semibold text-yellow-600">{lowStockCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Out of Stock</span>
                <span className="font-semibold text-red-600">
                  {products.filter((p: Product) => p.status === "Critical").length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Transactions</span>
                <span className="font-semibold text-gray-900">{totalTransactions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">{completedTransactions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-red-600">
                  {transactions.filter((t: MoveTransaction) => t.status === "Waiting").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Late</span>
                <span className="font-semibold text-orange-600">
                  {transactions.filter((t: MoveTransaction) => t.status === "Late").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === "transactions" && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reference</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((t: MoveTransaction) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{t.reference}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{t.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{t.date}</td>
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
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Stock by Category</h3>
          <div className="space-y-4">
            {["Electronic", "Tech", "Furniture", "Clothing"].map((category) => {
              const categoryStock = products
                .filter((p: Product) => p.category === category)
                .reduce((sum: number, p: Product) => sum + p.totalStock, 0)
              return (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">{category}</span>
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${(categoryStock / totalStock) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-900 font-semibold">{categoryStock} units</span>
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
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and system preferences</p>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
            <input
              type="email"
              value="john.doe@stockmaster.com"
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
            <input type="text" defaultValue="John Doe" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Company Name</label>
            <input
              type="text"
              defaultValue="Tech Solutions Inc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange("language", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange("timezone", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option>UTC</option>
              <option>EST</option>
              <option>CST</option>
              <option>PST</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange("currency", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Notifications</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-gray-900">Email Notifications</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.stockAlerts}
              onChange={(e) => handleSettingChange("stockAlerts", e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-gray-900">Low Stock Alerts</span>
          </label>
        </div>
      </div>

      <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
        Save Settings
      </button>
    </div>
  )
}

function ProfilePage() {
  const [editMode, setEditMode] = useState(false)
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john.doe@stockmaster.com",
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
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your personal and professional information</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {/* Profile Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex gap-6 items-start">
            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              JD
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.fullName}</h2>
              <p className="text-gray-600">{profile.role}</p>
              <p className="text-gray-600 text-sm mt-2">{profile.department}</p>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-6 py-2 rounded-lg font-semibold transition ${editMode ? "bg-gray-200 text-gray-900 hover:bg-gray-300" : "bg-red-600 text-white hover:bg-red-700"
              }`}
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
              {editMode ? (
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-900 font-medium">{profile.fullName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
              <p className="text-gray-900">{profile.email}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Phone</label>
              {editMode ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{profile.phone}</p>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Professional Information</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Role</label>
              <p className="text-gray-900 font-medium">{profile.role}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Department</label>
              <p className="text-gray-900">{profile.department}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Company</label>
              <p className="text-gray-900">{profile.company}</p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Location</label>
                <p className="text-gray-900">{profile.location}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Join Date</label>
                <p className="text-gray-900">{profile.joinDate}</p>
              </div>
            </div>
          </div>
        </div>

        {editMode && (
          <div className="mt-8 pt-8 border-t border-gray-200 flex gap-4">
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold">
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Account Security */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Account Security</h3>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            Change Password
          </button>
          <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            Two-Factor Authentication
          </button>
          <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            Active Sessions
          </button>
        </div>
      </div>
    </div>
  )
}
