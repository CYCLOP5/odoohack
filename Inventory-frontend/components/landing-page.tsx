"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Package, TrendingUp, Clock, AlertCircle, Check, Zap, Shield, BarChart3, ArrowRight, ChevronRight } from "lucide-react"

export default function LandingPage({ onNavigateToAuth }: { onNavigateToAuth: () => void }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef(null)
  const [activeMetric, setActiveMetric] = useState(0)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      description: "Live dashboards with instant insights into your inventory performance",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: Clock,
      title: "24/7 Accessibility",
      description: "Cloud-based platform accessible anywhere, anytime on any device",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: AlertCircle,
      title: "Smart Automation",
      description: "AI-powered alerts and automatic reordering to prevent stockouts",
      color: "from-amber-500 to-yellow-500"
    },
    {
      icon: Package,
      title: "Multi-Warehouse",
      description: "Centralized control over unlimited locations and warehouses",
      color: "from-yellow-500 to-red-500"
    }
  ]

  const stats = [
    { value: "10K+", label: "Active Users", icon: "👥" },
    { value: "50M+", label: "Items Tracked", icon: "📦" },
    { value: "99.9%", label: "Uptime", icon: "⚡" },
    { value: "24/7", label: "Support", icon: "💬" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
          style={{
            top: '10%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
          style={{
            top: '40%',
            right: '10%',
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.015}px)`
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
          style={{
            bottom: '10%',
            left: '30%',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.01}px)`
          }}
        />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 md:px-12 md:py-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              StockMaster
            </h1>
          </div>
          <Button 
            onClick={onNavigateToAuth} 
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Get Started <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative px-6 md:px-12 pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 rounded-full border border-red-200 animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <p className="text-sm font-semibold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Real-time Inventory Intelligence
                </p>
              </div>

              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Inventory
                <span className="block mt-2 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent animate-gradient">
                  Reimagined
                </span>
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed">
                Transform chaos into clarity. StockMaster delivers real-time visibility across every warehouse, 
                every product, every moment.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onNavigateToAuth}
                  className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl overflow-hidden shadow-2xl hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                
                <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-red-300 hover:bg-red-50 transform hover:scale-105 transition-all duration-300 shadow-lg"  onClick={onNavigateToAuth} >
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                {stats.slice(0, 2).map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated Dashboard Preview */}
            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Dashboard</div>
                      <div className="text-xs text-gray-500">Live Overview</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-green-700">Live</span>
                  </div>
                </div>

                {/* Animated Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "Total Items", value: "12,847", change: "+12%", positive: true },
                    { label: "Low Stock", value: "23", change: "-8%", positive: true },
                    { label: "Value", value: "$2.4M", change: "+15%", positive: true },
                    { label: "Locations", value: "8", change: "+2", positive: true }
                  ].map((metric, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="text-xs text-gray-500 mb-1">{metric.label}</div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                      <div className={`text-xs font-medium ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Animated Chart */}
                <div className="space-y-3">
                  {[85, 60, 95, 70, 100].map((height, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="text-xs text-gray-500 w-16">Item {idx + 1}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${height}%`,
                            animationDelay: `${idx * 200}ms`
                          }}
                        />
                      </div>
                      <div className="text-xs font-medium text-gray-700 w-12">{height}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl opacity-20 blur-2xl animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl opacity-20 blur-2xl animate-pulse animation-delay-2000" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 md:px-12 py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-red-50 rounded-full mb-4">
              <span className="text-sm font-semibold text-red-600">✨ Powerful Features</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for modern businesses that demand speed, accuracy, and reliability
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-red-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="mt-4 flex items-center text-red-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="relative px-6 md:px-12 py-16 md:py-24 bg-gradient-to-br from-red-600 via-orange-600 to-red-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by Industry Leaders
            </h3>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Join thousands of businesses optimizing their inventory with StockMaster
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "85%", label: "Reduced Stockouts", icon: Check },
              { value: "3x", label: "Faster Processing", icon: Zap },
              { value: "40%", label: "Cost Savings", icon: TrendingUp },
              { value: "99.8%", label: "Accuracy Rate", icon: Shield }
            ].map((metric, idx) => (
              <div 
                key={idx} 
                className={`text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 ${activeMetric === idx ? 'ring-4 ring-white/50 scale-105' : ''}`}
              >
                <div className="inline-flex w-16 h-16 items-center justify-center bg-white/20 rounded-full mb-4">
                  <metric.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl md:text-6xl font-bold text-white mb-3">{metric.value}</div>
                <div className="text-red-100 text-lg font-medium">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 md:px-12 py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl mb-8">
            <div className="bg-white px-6 py-3 rounded-xl">
              <span className="text-sm font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                🎉 Limited Time Offer - 30 Days Free
              </span>
            </div>
          </div>

          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Ready to Transform Your
            <span className="block bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Inventory Operations?
            </span>
          </h3>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join over 10,000 businesses already using StockMaster to streamline their inventory management
          </p>

          <button
            onClick={onNavigateToAuth}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg font-bold rounded-xl overflow-hidden shadow-2xl hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-300"
          >
            <span className="relative z-10">Start Your Free Trial</span>
            <ArrowRight className="relative z-10 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <p className="mt-6 text-sm text-gray-500">
            No credit card required • Set up in 5 minutes • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold">StockMaster</h1>
              </div>
              <p className="text-gray-400 text-sm">
                Modern inventory management for modern businesses
              </p>
            </div>
            
            {[
              { title: "Product", links: ["Features", "Pricing", "Security", "Roadmap"] },
              { title: "Company", links: ["About", "Careers", "Blog", "Press"] },
              { title: "Support", links: ["Help Center", "Contact", "Status", "API Docs"] }
            ].map((section, idx) => (
              <div key={idx}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">© 2025 StockMaster. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}