"use client"

import { useState, useEffect } from "react"
import { getProducts, subscribeToKPIs } from "@/lib/firestore-operations"
import type { Product, Dashboard } from "@/lib/firestore-types"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, loading, error }
}

export function useKPIs() {
  const [kpis, setKpis] = useState<Dashboard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToKPIs((data) => {
      setKpis(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { kpis, loading }
}
