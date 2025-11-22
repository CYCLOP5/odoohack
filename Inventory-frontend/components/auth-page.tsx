"use client"

import type React from "react"

import { useState } from "react"
import {
  Package,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  Chrome,
  Github,
  Loader2,
  ShieldCheck,
} from "lucide-react"
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"
import { getFirebaseAuth } from "@/lib/firebase"
import Background3D from "@/components/3d-background"

type AuthView = "login" | "signup" | "forgot-password"

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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const auth = getFirebaseAuth()

  const showNotif = (type: Notification["type"], message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3500)
  }

  const resetForm = () => {
    setPassword("")
    setConfirmPassword("")
  }

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault()
    if (view === "signup" && password !== confirmPassword) {
      showNotif("error", "Passwords do not match")
      return
    }

    try {
      setIsSubmitting(true)
      if (view === "login") {
        await signInWithEmailAndPassword(auth, email, password)
        showNotif("success", "Welcome back! Redirecting to dashboard...")
        onLoginSuccess?.()
      } else {
        const credentials = await createUserWithEmailAndPassword(auth, email, password)
        if (name.trim()) {
          await updateProfile(credentials.user, { displayName: name.trim() })
        }
        showNotif("success", "Account created successfully")
        onLoginSuccess?.()
      }
      resetForm()
    } catch (error: any) {
      const message = error?.message?.replace("Firebase: ", "") || "Something went wrong"
      showNotif("error", message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      setIsSubmitting(true)
      await sendPasswordResetEmail(auth, email)
      showNotif("info", `Reset link sent to ${email}`)
      setTimeout(() => setView("login"), 1500)
    } catch (error: any) {
      const message = error?.message?.replace("Firebase: ", "") || "Unable to send reset email"
      showNotif("error", message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialLogin = async (providerType: "google" | "github") => {
    try {
      setIsSubmitting(true)
      const provider =
        providerType === "google" ? new GoogleAuthProvider() : new GithubAuthProvider()

      if (providerType === "google") {
        provider.setCustomParameters({ prompt: "select_account" })
      }

      await signInWithPopup(auth, provider)
      showNotif("success", `Signed in with ${providerType === "google" ? "Google" : "GitHub"}`)
      onLoginSuccess?.()
    } catch (error: any) {
      const message = error?.message?.replace("Firebase: ", "") || "Social login failed"
      showNotif("error", message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <Background3D />

      {notification && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 animate-fade-in shadow-lg ${
            notification.type === "success"
              ? "bg-[#017E84]"
              : notification.type === "error"
                ? "bg-red-600"
                : "bg-[#714B67]"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={onBackToLanding}
          className="mb-6 flex items-center gap-2 text-white hover:text-white/80 transition-colors font-semibold glass-panel-dark border border-white/10 px-4 py-2 rounded-lg backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="glass-panel-dark border border-white/10 p-8 rounded-2xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#714B67] to-[#017E84] rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Odoo Inventory IQ</h2>
              <p className="text-xs text-white/60 flex items-center gap-1 justify-center">
                <ShieldCheck className="w-3.5 h-3.5" /> Enterprise-grade security
              </p>
            </div>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white">
              {view === "login" && "Sign In"}
              {view === "signup" && "Create Account"}
              {view === "forgot-password" && "Reset Password"}
            </h3>
            <p className="text-white/70 text-sm mt-2">
              {view === "login" && "Access all your operational dashboards"}
              {view === "signup" && "Invite-only beta. Use your work email."}
              {view === "forgot-password" && "We'll send a secure reset link to your inbox."}
            </p>
          </div>

          <form
            onSubmit={view === "forgot-password" ? handleForgotPassword : handleEmailAuth}
            className="space-y-5"
          >
            {view === "signup" && (
              <div className="relative group">
                <User className="absolute left-3 top-3 w-5 h-5 text-white/60 group-focus-within:text-[#017E84] transition-colors" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#017E84] transition-all"
                  required
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-white/60 group-focus-within:text-[#017E84] transition-colors" />
              <input
                type="email"
                placeholder="Work Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#017E84] transition-all"
                required
              />
            </div>

            {view !== "forgot-password" && (
              <div className="space-y-3">
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-white/60 group-focus-within:text-[#017E84] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#017E84] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-3 text-white/60 hover:text-[#017E84] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {view === "signup" && (
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-white/60 group-focus-within:text-[#017E84] transition-colors" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#017E84] transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-3 text-white/60 hover:text-[#017E84] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#714B67] to-[#017E84] hover:from-[#5e3d55] hover:to-[#016d72] text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {view === "login" && "Sign In"}
              {view === "signup" && "Create Account"}
              {view === "forgot-password" && "Send Reset Link"}
            </button>
          </form>

          {view !== "forgot-password" && (
            <div className="mt-6">
              <div className="flex items-center gap-3 text-white/50 text-xs uppercase tracking-widest">
                <span className="flex-1 h-px bg-white/10" />
                <span>Single Tap Login</span>
                <span className="flex-1 h-px bg-white/10" />
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                  className="w-full flex items-center justify-center gap-2 border border-white/15 rounded-xl py-3 text-white/80 hover:text-white hover:border-white/30 transition"
                  disabled={isSubmitting}
                >
                  <Chrome className="w-5 h-5" />
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("github")}
                  className="w-full flex items-center justify-center gap-2 border border-white/15 rounded-xl py-3 text-white/80 hover:text-white hover:border-white/30 transition"
                  disabled={isSubmitting}
                >
                  <Github className="w-5 h-5" />
                  GitHub
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-3 text-center">
            {view === "login" && (
              <>
                <button
                  onClick={() => setView("signup")}
                  className="block w-full text-[#39c1c9] hover:text-white text-sm font-semibold transition-colors"
                  disabled={isSubmitting}
                >
                  Need access? Create your workspace account
                </button>
                <button
                  onClick={() => setView("forgot-password")}
                  className="block w-full text-white/60 hover:text-white text-sm transition-colors"
                  disabled={isSubmitting}
                >
                  Forgot password?
                </button>
              </>
            )}

            {view === "signup" && (
              <button
                onClick={() => setView("login")}
                className="block w-full text-[#39c1c9] hover:text-white text-sm font-semibold transition-colors"
                disabled={isSubmitting}
              >
                Already have an account? Sign in
              </button>
            )}

            {view === "forgot-password" && (
              <button
                onClick={() => setView("login")}
                className="block w-full text-[#39c1c9] hover:text-white text-sm font-semibold transition-colors"
                disabled={isSubmitting}
              >
                Back to login
              </button>
            )}
          </div>

          {view === "login" && (
            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-white font-bold mb-2 uppercase tracking-wider">Demo Credentials</p>
              <div className="space-y-1">
                <p className="text-xs text-white/70 flex justify-between">
                  <span>Email:</span>
                  <code className="bg-white/10 px-2 py-0.5 rounded text-[#39c1c9] font-mono">demo@odooinventoryiq.com</code>
                </p>
                <p className="text-xs text-white/70 flex justify-between">
                  <span>Password:</span>
                  <code className="bg-white/10 px-2 py-0.5 rounded text-[#39c1c9] font-mono">demo123</code>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
