# StockMaster - Firestore Setup Guide

## Overview

StockMaster uses Firebase Firestore as its backend database for real-time inventory management. This document provides setup instructions and data model documentation.

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create Project" and name it "StockMaster"
3. Enable Google Analytics (optional)
4. Create the project

### 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get Started"
3. Enable "Email/Password" provider
4. Enable "Anonymous" authentication for demo purposes

### 3. Create Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create Database"
3. Choose "Start in production mode"
4. Select your preferred region (e.g., us-central1)
5. Click "Enable"

### 4. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Copy your Firebase config credentials
3. Add them to your `.env.local` file:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_value
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value
NEXT_PUBLIC_FIREBASE_APP_ID=your_value
\`\`\`

### 5. Set Firestore Security Rules

1. Go to Firestore Database > Rules
2. Replace with these rules:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /stock_by_location/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /move_history/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /categories/{document=**} {
      allow read: if request.auth != null;
    }
    match /warehouses/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
\`\`\`

3. Click "Publish"

### 6. Initialize Sample Data

Run the setup script to initialize collections with sample data:

\`\`\`bash
npm run setup-firestore
\`\`\`

## Data Models

### Products Collection

\`\`\`typescript
{
  sku: string;              // Unique SKU
  name: string;             // Product name
  category: string;         // Category name
  description: string;      // Product description
  price: number;            // Product price
  reorderMin: number;       // Minimum stock for reorder
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: timestamp;
  updatedAt: timestamp;
}
\`\`\`

### Stock by Location Collection

\`\`\`typescript
{
  productId: string;        // Reference to products
  location: string;         // Warehouse location name
  quantity: number;         // Current stock quantity
  warehouseId: string;      // Warehouse ID
  lastUpdated: timestamp;
}
\`\`\`

### Move History Collection

\`\`\`typescript
{
  type: 'Receipt' | 'Delivery' | 'Transfer' | 'Adjustment';
  status: 'Draft' | 'Waiting' | 'Ready' | 'Done' | 'Canceled';
  productId: string;        // Reference to products
  quantity: number;         // Quantity moved
  fromLocation: string;
  toLocation: string;
  sourceWarehouse?: string;
  destinationWarehouse?: string;
  createdAt: timestamp;
  updatedAt: timestamp;
  createdBy: string;        // User ID who created
  notes?: string;           // Additional notes
}
\`\`\`

### Categories Collection

\`\`\`typescript
{
  name: string;             // Category name
  description?: string;     // Category description
  createdAt: timestamp;
}
\`\`\`

### Warehouses Collection

\`\`\`typescript
{
  name: string;             // Warehouse name
  location: string;         // Physical location
  capacity: number;         // Max storage capacity
  currentUtilization: number; // Current usage
  status: 'active' | 'inactive';
  createdAt: timestamp;
}
\`\`\`

## API Functions

All database operations are in `lib/firestore-operations.ts`:

### Products
- `getProducts()` - Fetch all products
- `getProductById(id)` - Fetch single product
- `createProduct(data)` - Create new product
- `updateProduct(id, updates)` - Update product
- `deleteProduct(id)` - Delete product

### Stock
- `getStockByLocation(productId)` - Get stock across locations
- `updateStockByLocation(productId, location, quantity)` - Update stock

### Move History
- `getMoveHistory(filters)` - Get filtered transactions
- `createMoveHistory(data)` - Log transaction
- `updateMoveStatus(moveId, status)` - Update transaction status

### Dashboard
- `getDashboardKPIs()` - Get KPI snapshot
- `subscribeToKPIs(callback)` - Real-time KPI updates

## Hooks

Use these React hooks for data management:

\`\`\`typescript
import { useProducts, useKPIs } from '@/hooks/use-products';

// Fetch all products
const { products, loading, error } = useProducts();

// Real-time KPI updates
const { kpis, loading } = useKPIs();
\`\`\`

## Real-time Listeners

Subscribe to real-time updates:

\`\`\`typescript
import { subscribeToKPIs } from '@/lib/firestore-operations';

const unsubscribe = subscribeToKPIs((data) => {
  console.log('KPIs updated:', data);
});

// Cleanup on unmount
return () => unsubscribe();
\`\`\`

## Troubleshooting

### "Permission denied" errors
- Check Firestore security rules
- Ensure user is authenticated
- Verify user has correct permissions

### "Collection not found"
- Run the setup script to initialize collections
- Check collection names match exactly

### Real-time updates not working
- Ensure Firestore listeners are properly subscribed
- Check browser console for errors
- Verify Network tab shows Firestore requests

## Next Steps

1. Integrate hooks into your components
2. Replace mock data with real Firestore queries
3. Set up Firebase Authentication flow
4. Configure data validation and error handling
5. Set up monitoring and analytics
