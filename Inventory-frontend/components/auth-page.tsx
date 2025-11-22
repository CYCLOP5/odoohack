"use client"

import type React from "react"

import { useState } from "react"
import { Package, Mail, Lock, User, Eye, EyeOff } from "lucide-react"

type AuthView = "login" | "signup" | "forgot-password" | "reset-password"

interface Notification {
  type: "success" | "error" | "info"
  message: string
}

interface AuthPageProps {
  onBackToLanding: () => void
  onLoginSuccess?: () => void
}

export default function AuthPage({ onBackToLanding, onLoginSuccess }: AuthPageProps) {
  const [view, setView] = useState<AuthView>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [notification, setNotification] = useState<Notification | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [resetPassword, setResetPassword] = useState("")

  const showNotif = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === "demo@stockmaster.com" && password === "demo123") {
      showNotif("success", "Welcome back! Redirecting to dashboard...")
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess()
      }, 1500)
    } else {
      showNotif("error", "Invalid credentials. Try demo@stockmaster.com / demo123")
    }
    setEmail("")
    setPassword("")
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email && password === confirmPassword && password.length >= 6) {
      showNotif("success", "Account created! Redirecting to login...")
      setTimeout(() => {
        setView("login")
        setName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
      }, 2000)
    } else {
      showNotif("error", "Please check your information and try again")
    }
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    showNotif("info", `OTP sent to ${email}`)
    setView("reset-password")
    setEmail("")
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp && resetPassword) {
      showNotif("success", "Password reset successful! Redirecting to login...")
      setTimeout(() => {
        setView("login")
        setOtp("")
        setResetPassword("")
      }, 2000)
    } else {
      showNotif("error", "Please enter both OTP and new password")
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 animate-fade-in ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "error"
                ? "bg-red-600"
                : "bg-blue-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={onBackToLanding}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Back to Home
        </button>

        {/* Card */}
        <div className="bg-white rounded-lg border-2 border-red-600 shadow-lg p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">StockMaster</h2>
          </div>

          {/* View Title */}
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
            {view === "login" && "Sign In"}
            {view === "signup" && "Create Account"}
            {view === "forgot-password" && "Reset Password"}
            {view === "reset-password" && "Set New Password"}
          </h3>
          <p className="text-center text-gray-600 text-sm mb-6">
            {view === "login" && "Don't have an account? "}
            {view === "signup" && "Already have an account? "}
            {view === "forgot-password" && "Enter your email to receive an OTP"}
            {view === "reset-password" && "Enter the OTP and your new password"}
          </p>

          {/* Forms */}
          <form
            onSubmit={(e) => {
              if (view === "login") handleLogin(e)
              else if (view === "signup") handleSignup(e)
              else if (view === "forgot-password") handleForgotPassword(e)
              else if (view === "reset-password") handleResetPassword(e)
            }}
            className="space-y-4"
          >
            {/* Sign Up Fields */}
            {view === "signup" && (
              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            {(view === "login" || view === "signup" || view === "forgot-password") && (
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            )}

            {/* Password Field */}
            {(view === "login" || view === "signup") && (
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            )}

            {/* Confirm Password Field */}
            {view === "signup" && (
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            )}

            {/* OTP Field */}
            {view === "reset-password" && (
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            )}

            {/* New Password Field */}
            {view === "reset-password" && (
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 mt-6"
            >
              {view === "login" && "Sign In"}
              {view === "signup" && "Create Account"}
              {view === "forgot-password" && "Send OTP"}
              {view === "reset-password" && "Reset Password"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-xs text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Links */}
          <div className="space-y-2 text-center">
            {view === "login" && (
              <>
                <button
                  onClick={() => setView("signup")}
                  className="block w-full text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Don't have an account? Sign up
                </button>
                <button
                  onClick={() => setView("forgot-password")}
                  className="block w-full text-gray-600 hover:text-gray-700 text-sm"
                >
                  Forgot password?
                </button>
              </>
            )}
            {view === "signup" && (
              <button
                onClick={() => setView("login")}
                className="block w-full text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Already have an account? Sign in
              </button>
            )}
            {view === "forgot-password" && (
              <button
                onClick={() => setView("login")}
                className="block w-full text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Back to login
              </button>
            )}
            {view === "reset-password" && (
              <button
                onClick={() => setView("login")}
                className="block w-full text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Back to login
              </button>
            )}
          </div>

          {/* Demo Credentials */}
          {view === "login" && (
            <div className="mt-6 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs text-gray-600 mb-2">
                <strong>Demo Credentials:</strong>
              </p>
              <p className="text-xs text-gray-600">
                Email: <code className="bg-white px-1">demo@stockmaster.com</code>
              </p>
              <p className="text-xs text-gray-600">
                Password: <code className="bg-white px-1">demo123</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
