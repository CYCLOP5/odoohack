import { supabase } from "./supabase"
import type { Product, StockByLocation, MoveHistory, Category, Warehouse, Dashboard } from "./firestore-types"

// ============ HELPERS ============

function mapProduct(data: any): Product {
  return {
    id: data.id,
    sku: data.sku,
    name: data.name,
    category: data.category,
    description: data.description,
    price: data.price,
    reorderMin: data.reorder_min,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    status: data.status,
  }
}

function mapStockByLocation(data: any): StockByLocation {
  return {
    productId: data.product_id,
    location: data.location,
    quantity: data.quantity,
    lastUpdated: new Date(data.last_updated),
    warehouseId: data.warehouse_id,
  }
}

function mapMoveHistory(data: any): MoveHistory {
  return {
    id: data.id,
    type: data.type,
    status: data.status,
    productId: data.product_id,
    quantity: data.quantity,
    fromLocation: data.from_location,
    toLocation: data.to_location,
    sourceWarehouse: data.source_warehouse,
    destinationWarehouse: data.destination_warehouse,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    createdBy: data.created_by,
    notes: data.notes,
  }
}

function mapCategory(data: any): Category {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    createdAt: new Date(data.created_at),
  }
}

function mapWarehouse(data: any): Warehouse {
  return {
    id: data.id,
    name: data.name,
    location: data.location,
    capacity: data.capacity,
    currentUtilization: data.current_utilization,
    status: data.status,
    createdAt: new Date(data.created_at),
  }
}

// ============ PRODUCTS OPERATIONS ============

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data.map(mapProduct)
}

export async function getProductById(productId: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return mapProduct(data)
}

export async function createProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const { data, error } = await supabase
    .from("products")
    .insert({
      sku: product.sku,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      reorder_min: product.reorderMin,
      status: product.status,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating product:", error)
    throw error
  }

  return data.id
}

export async function updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
  const updateData: any = { ...updates, updated_at: new Date().toISOString() }
  
  // Map camelCase to snake_case for updates
  if (updates.reorderMin !== undefined) updateData.reorder_min = updates.reorderMin
  delete updateData.reorderMin
  delete updateData.createdAt
  delete updateData.updatedAt
  delete updateData.id

  const { error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", productId)

  if (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)

  if (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

// ============ STOCK BY LOCATION OPERATIONS ============

export async function getStockByLocation(productId: string): Promise<StockByLocation[]> {
  const { data, error } = await supabase
    .from("stock_by_location")
    .select("*")
    .eq("product_id", productId)

  if (error) {
    console.error("Error fetching stock by location:", error)
    return []
  }

  return data.map(mapStockByLocation)
}

export async function getAllStock(): Promise<StockByLocation[]> {
  const { data, error } = await supabase
    .from("stock_by_location")
    .select("*")

  if (error) {
    console.error("Error fetching all stock:", error)
    return []
  }

  return data.map(mapStockByLocation)
}

export async function updateStockByLocation(productId: string, location: string, quantity: number): Promise<void> {
  // Check if exists
  const { data: existing } = await supabase
    .from("stock_by_location")
    .select("id")
    .eq("product_id", productId)
    .eq("location", location)
    .single()

  if (existing) {
    const { error } = await supabase
      .from("stock_by_location")
      .update({
        quantity,
        last_updated: new Date().toISOString(),
      })
      .eq("id", existing.id)

    if (error) throw error
  } else {
    const { error } = await supabase
      .from("stock_by_location")
      .insert({
        product_id: productId,
        location,
        quantity,
        last_updated: new Date().toISOString(),
      })

    if (error) throw error
  }
}

// ============ MOVE HISTORY OPERATIONS ============

export async function getMoveHistory(filters?: {
  type?: string
  status?: string
  location?: string
}): Promise<MoveHistory[]> {
  let query = supabase
    .from("move_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  if (filters?.type) query = query.eq("type", filters.type)
  if (filters?.status) query = query.eq("status", filters.status)
  if (filters?.location) query = query.eq("from_location", filters.location)

  const { data, error } = await query

  if (error) {
    console.error("Error fetching move history:", error)
    return []
  }

  return data.map(mapMoveHistory)
}

export async function createMoveHistory(move: Omit<MoveHistory, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const { data, error } = await supabase
    .from("move_history")
    .insert({
      type: move.type,
      status: move.status,
      product_id: move.productId,
      quantity: move.quantity,
      from_location: move.fromLocation,
      to_location: move.toLocation,
      source_warehouse: move.sourceWarehouse,
      destination_warehouse: move.destinationWarehouse,
      created_by: move.createdBy,
      notes: move.notes,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating move history:", error)
    throw error
  }

  return data.id
}

export async function updateMoveStatus(moveId: string, status: string): Promise<void> {
  const { error } = await supabase
    .from("move_history")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", moveId)

  if (error) {
    console.error("Error updating move status:", error)
    throw error
  }
}

type MoveHistoryUpdate = Partial<{
  type: MoveHistory["type"]
  status: MoveHistory["status"]
  productId: string
  quantity: number
  fromLocation: string | null
  toLocation: string | null
  sourceWarehouse: string | null
  destinationWarehouse: string | null
  createdBy: string | null
  notes: string | null
}>

export async function updateMoveHistoryEntry(moveId: string, updates: MoveHistoryUpdate): Promise<void> {
  if (!moveId) return

  const payload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  if (updates.type !== undefined) payload.type = updates.type
  if (updates.status !== undefined) payload.status = updates.status
  if (updates.productId !== undefined) payload.product_id = updates.productId
  if (updates.quantity !== undefined) payload.quantity = updates.quantity
  if (updates.fromLocation !== undefined) payload.from_location = updates.fromLocation
  if (updates.toLocation !== undefined) payload.to_location = updates.toLocation
  if (updates.sourceWarehouse !== undefined) payload.source_warehouse = updates.sourceWarehouse
  if (updates.destinationWarehouse !== undefined) payload.destination_warehouse = updates.destinationWarehouse
  if (updates.createdBy !== undefined) payload.created_by = updates.createdBy
  if (updates.notes !== undefined) payload.notes = updates.notes

  const { error } = await supabase
    .from("move_history")
    .update(payload)
    .eq("id", moveId)

  if (error) {
    console.error("Error updating move history entry:", error)
    throw error
  }
}

export async function deleteMoveHistoryEntry(moveId: string): Promise<void> {
  if (!moveId) return

  const { error } = await supabase
    .from("move_history")
    .delete()
    .eq("id", moveId)

  if (error) {
    console.error("Error deleting move history entry:", error)
    throw error
  }
}

// ============ DASHBOARD KPI OPERATIONS ============

export async function getDashboardKPIs(): Promise<Dashboard> {
  try {
    // We can optimize this with count queries instead of fetching all data
    const { count: totalProductsInStock } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })

    const { count: lowStockItems } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .gt("reorder_min", 0) // Simplified logic, ideally check quantity vs reorder_min

    const { count: pendingReceipts } = await supabase
      .from("move_history")
      .select("*", { count: "exact", head: true })
      .eq("type", "Receipt")
      .eq("status", "Waiting")

    const { count: pendingDeliveries } = await supabase
      .from("move_history")
      .select("*", { count: "exact", head: true })
      .eq("type", "Delivery")
      .eq("status", "Waiting")

    return {
      totalProductsInStock: totalProductsInStock || 0,
      lowStockItems: lowStockItems || 0,
      pendingReceipts: pendingReceipts || 0,
      pendingDeliveries: pendingDeliveries || 0,
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

export function subscribeToKPIs(callback: (data: Dashboard) => void): () => void {
  // Realtime subscription for dashboard updates
  const channel = supabase
    .channel('dashboard-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      () => {
        getDashboardKPIs().then(callback)
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'move_history' },
      () => {
        getDashboardKPIs().then(callback)
      }
    )
    .subscribe()

  // Initial fetch
  getDashboardKPIs().then(callback)

  return () => {
    supabase.removeChannel(channel)
  }
}

// ============ CATEGORIES OPERATIONS ============

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data.map(mapCategory)
}

// ============ WAREHOUSES OPERATIONS ============

export async function getWarehouses(): Promise<Warehouse[]> {
  const { data, error } = await supabase
    .from("warehouses")
    .select("*")

  if (error) {
    console.error("Error fetching warehouses:", error)
    return []
  }

  return data.map(mapWarehouse)
}

// ============ BATCH OPERATIONS ============

export async function batchUpdateStockAndMoveHistory(
  productId: string,
  stockUpdates: { location: string; quantity: number }[],
  moveHistoryData: Omit<MoveHistory, "id" | "createdAt" | "updatedAt">,
): Promise<void> {
  // Supabase doesn't have a direct "batch" like Firestore, but we can use RPC or just sequential awaits.
  // For strict atomicity, we should use an RPC (Postgres function).
  // For now, we'll do sequential operations which is "good enough" for this prototype, 
  // but in production, use RPC.

  try {
    // 1. Update stock
    for (const update of stockUpdates) {
      await updateStockByLocation(productId, update.location, update.quantity)
    }

    // 2. Create move history
    await createMoveHistory(moveHistoryData)

  } catch (error) {
    console.error("Error in batch operation:", error)
    throw error
  }
}
