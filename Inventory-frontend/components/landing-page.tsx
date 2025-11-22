"use client"

import { Button } from "@/components/ui/button"
import { Package, TrendingUp, Clock, AlertCircle } from "lucide-react"

export default function LandingPage({ onNavigateToAuth }: { onNavigateToAuth: () => void }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 md:py-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">StockMaster</h1>
        </div>
        <Button onClick={onNavigateToAuth} className="bg-red-600 hover:bg-red-700 text-white">
          Sign In
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 bg-red-50 rounded-full">
            <p className="text-sm font-medium text-red-600">✨ Real-time Inventory Tracking</p>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Real-time Inventory
            <span className="block text-red-600">Management Done Right</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Replace manual tracking with centralized, real-time inventory management. StockMaster gives you complete
            visibility across all your warehouses and locations.
          </p>

          <button
            onClick={onNavigateToAuth}
            className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200"
          >
            Start Managing Inventory Now
            <span>→</span>
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 md:px-12 py-12 md:py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">Why Choose StockMaster?</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h4>
              <p className="text-gray-600 text-sm">Instant visibility into stock levels across all locations</p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Always Available</h4>
              <p className="text-gray-600 text-sm">Access your inventory anytime, anywhere with cloud-based platform</p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Smart Alerts</h4>
              <p className="text-gray-600 text-sm">Never miss low stock items with intelligent reorder notifications</p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Multi-Location</h4>
              <p className="text-gray-600 text-sm">
                Manage multiple warehouses and fulfillment centers from one dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="px-6 md:px-12 py-12 md:py-16 bg-red-600">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">What You Get With StockMaster</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Reduced Stockouts", value: "85%" },
              { label: "Faster Processing", value: "3x" },
              { label: "Cost Savings", value: "40%" },
              { label: "Accuracy Rate", value: "99.8%" },
            ].map((metric, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">{metric.value}</p>
                <p className="text-red-100 text-sm md:text-base">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-white">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
            Ready to Transform Your Inventory Management?
          </h3>
          <p className="text-lg text-gray-600">
            Join hundreds of companies using StockMaster to optimize their operations.
          </p>
          <button
            onClick={onNavigateToAuth}
            className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200"
          >
            Start Managing Inventory Now
            <span>→</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-gray-600 text-sm">© 2025 StockMaster. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              Privacy
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              Terms
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
