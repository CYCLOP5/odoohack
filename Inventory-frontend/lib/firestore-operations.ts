import { getFirebaseDb } from "./firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  type Unsubscribe,
  type QueryConstraint,
  orderBy,
  limit,
  addDoc,
  writeBatch,
} from "firebase/firestore"
import type { Product, StockByLocation, MoveHistory, Category, Warehouse, Dashboard } from "./firestore-types"

const db = getFirebaseDb()

// ============ PRODUCTS OPERATIONS ============

export async function getProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products")
    const snapshot = await getDocs(productsRef)
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }) as Product,
    )
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const docRef = doc(db, "products", productId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate(),
      } as Product
    }
    return null
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export async function createProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    const productsRef = collection(db, "products")
    const docRef = await addDoc(productsRef, {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export async function updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
  try {
    const docRef = doc(db, "products", productId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    const docRef = doc(db, "products", productId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

// ============ STOCK BY LOCATION OPERATIONS ============

export async function getStockByLocation(productId: string): Promise<StockByLocation[]> {
  try {
    const stockRef = collection(db, "stock_by_location")
    const q = query(stockRef, where("productId", "==", productId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          lastUpdated: doc.data().lastUpdated?.toDate(),
        }) as StockByLocation,
    )
  } catch (error) {
    console.error("Error fetching stock by location:", error)
    return []
  }
}

export async function updateStockByLocation(productId: string, location: string, quantity: number): Promise<void> {
  try {
    const stockRef = collection(db, "stock_by_location")
    const q = query(stockRef, where("productId", "==", productId), where("location", "==", location))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      // Create new stock record
      await addDoc(stockRef, {
        productId,
        location,
        quantity,
        lastUpdated: new Date(),
      })
    } else {
      // Update existing stock record
      const docRef = doc(db, "stock_by_location", snapshot.docs[0].id)
      await updateDoc(docRef, {
        quantity,
        lastUpdated: new Date(),
      })
    }
  } catch (error) {
    console.error("Error updating stock by location:", error)
    throw error
  }
}

// ============ MOVE HISTORY OPERATIONS ============

export async function getMoveHistory(filters?: {
  type?: string
  status?: string
  location?: string
}): Promise<MoveHistory[]> {
  try {
    const constraints: QueryConstraint[] = []

    if (filters?.type) constraints.push(where("type", "==", filters.type))
    if (filters?.status) constraints.push(where("status", "==", filters.status))
    if (filters?.location) constraints.push(where("fromLocation", "==", filters.location))

    constraints.push(orderBy("createdAt", "desc"))
    constraints.push(limit(100))

    const moveHistoryRef = collection(db, "move_history")
    const q = query(moveHistoryRef, ...constraints)
    const snapshot = await getDocs(q)

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }) as MoveHistory,
    )
  } catch (error) {
    console.error("Error fetching move history:", error)
    return []
  }
}

export async function createMoveHistory(move: Omit<MoveHistory, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    const moveHistoryRef = collection(db, "move_history")
    const docRef = await addDoc(moveHistoryRef, {
      ...move,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating move history:", error)
    throw error
  }
}

export async function updateMoveStatus(moveId: string, status: string): Promise<void> {
  try {
    const docRef = doc(db, "move_history", moveId)
    await updateDoc(docRef, {
      status,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error updating move status:", error)
    throw error
  }
}

// ============ DASHBOARD KPI OPERATIONS ============

export async function getDashboardKPIs(): Promise<Dashboard> {
  try {
    const productsRef = collection(db, "products")
    const productsSnapshot = await getDocs(productsRef)
    const products = productsSnapshot.docs.map((doc) => doc.data() as Product)

    const moveHistoryRef = collection(db, "move_history")
    const movesSnapshot = await getDocs(moveHistoryRef)
    const moves = movesSnapshot.docs.map((doc) => doc.data() as MoveHistory)

    // Calculate KPIs
    const totalProductsInStock = products.length
    const lowStockItems = products.filter((p) => p.reorderMin > 0).length // Placeholder
    const pendingReceipts = moves.filter((m) => m.type === "Receipt" && m.status === "Waiting").length
    const pendingDeliveries = moves.filter((m) => m.type === "Delivery" && m.status === "Waiting").length

    return {
      totalProductsInStock,
      lowStockItems,
      pendingReceipts,
      pendingDeliveries,
      lastUpdated: new Date(),
    }
  } catch (error) {
    console.error("Error fetching dashboard KPIs:", error)
    return {
      totalProductsInStock: 0,
      lowStockItems: 0,
      pendingReceipts: 0,
      pendingDeliveries: 0,
      lastUpdated: new Date(),
    }
  }
}

export function subscribeToKPIs(callback: (data: Dashboard) => void): Unsubscribe {
  const productsRef = collection(db, "products")
  const movesRef = collection(db, "move_history")

  let productsData: Product[] = []
  let movesData: MoveHistory[] = []

  const unsubProducts = onSnapshot(productsRef, (snapshot) => {
    productsData = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Product,
    )
    updateDashboard()
  })

  const unsubMoves = onSnapshot(movesRef, (snapshot) => {
    movesData = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as MoveHistory,
    )
    updateDashboard()
  })

  function updateDashboard() {
    const totalProductsInStock = productsData.length
    const lowStockItems = productsData.filter((p) => p.reorderMin > 0).length
    const pendingReceipts = movesData.filter((m) => m.type === "Receipt" && m.status === "Waiting").length
    const pendingDeliveries = movesData.filter((m) => m.type === "Delivery" && m.status === "Waiting").length

    callback({
      totalProductsInStock,
      lowStockItems,
      pendingReceipts,
      pendingDeliveries,
      lastUpdated: new Date(),
    })
  }

  return () => {
    unsubProducts()
    unsubMoves()
  }
}

// ============ CATEGORIES OPERATIONS ============

export async function getCategories(): Promise<Category[]> {
  try {
    const categoriesRef = collection(db, "categories")
    const snapshot = await getDocs(categoriesRef)
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        }) as Category,
    )
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// ============ WAREHOUSES OPERATIONS ============

export async function getWarehouses(): Promise<Warehouse[]> {
  try {
    const warehousesRef = collection(db, "warehouses")
    const snapshot = await getDocs(warehousesRef)
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        }) as Warehouse,
    )
  } catch (error) {
    console.error("Error fetching warehouses:", error)
    return []
  }
}

// ============ BATCH OPERATIONS ============

export async function batchUpdateStockAndMoveHistory(
  productId: string,
  stockUpdates: { location: string; quantity: number }[],
  moveHistoryData: Omit<MoveHistory, "id" | "createdAt" | "updatedAt">,
): Promise<void> {
  try {
    const batch = writeBatch(db)
    const timestamp = new Date()

    // Update stock by location
    for (const update of stockUpdates) {
      const stockRef = collection(db, "stock_by_location")
      const q = query(stockRef, where("productId", "==", productId), where("location", "==", update.location))
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        const newDocRef = doc(collection(db, "stock_by_location"))
        batch.set(newDocRef, {
          productId,
          ...update,
          lastUpdated: timestamp,
        })
      } else {
        batch.update(doc(db, "stock_by_location", snapshot.docs[0].id), {
          quantity: update.quantity,
          lastUpdated: timestamp,
        })
      }
    }

    // Add move history
    const moveRef = doc(collection(db, "move_history"))
    batch.set(moveRef, {
      ...moveHistoryData,
      createdAt: timestamp,
      updatedAt: timestamp,
    })

    await batch.commit()
  } catch (error) {
    console.error("Error in batch operation:", error)
    throw error
  }
}
