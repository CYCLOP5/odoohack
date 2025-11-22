"use client"

interface FilterState {
  documentType: string
  status: string
  location: string
}

interface OperationalFiltersProps {
  filters: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
}

export default function OperationalFilters({ filters, onFilterChange }: OperationalFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Document Type Filter */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Document Type</label>
        <select
          value={filters.documentType}
          onChange={(e) => onFilterChange({ documentType: e.target.value })}
          className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
        >
          <option value="all">All Types</option>
          <option value="receipt">Receipt</option>
          <option value="delivery">Delivery</option>
          <option value="transfer">Transfer</option>
          <option value="adjustment">Adjustment</option>
        </select>
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Status</label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="waiting">Waiting</option>
          <option value="ready">Ready</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {/* Location/Warehouse Filter */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Warehouse/Location</label>
        <select
          value={filters.location}
          onChange={(e) => onFilterChange({ location: e.target.value })}
          className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
        >
          <option value="all">All Locations</option>
          <option value="warehouse-1">Main Warehouse</option>
          <option value="warehouse-2">North Distribution</option>
          <option value="warehouse-3">South Distribution</option>
          <option value="warehouse-4">East Fulfillment</option>
          <option value="warehouse-5">West Fulfillment</option>
        </select>
      </div>
    </div>
  )
}
