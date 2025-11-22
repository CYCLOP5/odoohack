// Firestore collection and document schema setup guide
// Run this script to initialize Firestore with proper data structures

/**
 * FIRESTORE COLLECTION STRUCTURE:
 *
 * 1. products (Collection)
 *    ├── Document ID (auto-generated)
 *    ├── sku: string
 *    ├── name: string
 *    ├── category: string
 *    ├── description: string
 *    ├── price: number
 *    ├── reorderMin: number
 *    ├── status: 'active' | 'inactive' | 'discontinued'
 *    ├── createdAt: timestamp
 *    └── updatedAt: timestamp
 *
 * 2. stock_by_location (Collection)
 *    ├── Document ID (auto-generated)
 *    ├── productId: string (reference to products)
 *    ├── location: string (warehouse name)
 *    ├── quantity: number
 *    ├── warehouseId: string
 *    └── lastUpdated: timestamp
 *
 * 3. move_history (Collection)
 *    ├── Document ID (auto-generated)
 *    ├── type: 'Receipt' | 'Delivery' | 'Transfer' | 'Adjustment'
 *    ├── status: 'Draft' | 'Waiting' | 'Ready' | 'Done' | 'Canceled'
 *    ├── productId: string
 *    ├── quantity: number
 *    ├── fromLocation: string
 *    ├── toLocation: string
 *    ├── sourceWarehouse: string
 *    ├── destinationWarehouse: string
 *    ├── createdAt: timestamp
 *    ├── updatedAt: timestamp
 *    ├── createdBy: string
 *    └── notes: string
 *
 * 4. categories (Collection)
 *    ├── Document ID (auto-generated or custom)
 *    ├── name: string
 *    ├── description: string
 *    └── createdAt: timestamp
 *
 * 5. warehouses (Collection)
 *    ├── Document ID (auto-generated or custom)
 *    ├── name: string
 *    ├── location: string
 *    ├── capacity: number
 *    ├── currentUtilization: number
 *    ├── status: 'active' | 'inactive'
 *    └── createdAt: timestamp
 *
 * 6. users (Collection)
 *    ├── uid: string (document ID, matches Firebase Auth UID)
 *    ├── email: string
 *    ├── displayName: string
 *    ├── role: 'admin' | 'manager' | 'staff'
 *    ├── warehouseAccess: array of warehouse IDs
 *    └── createdAt: timestamp
 *
 * FIRESTORE SECURITY RULES:
 *
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /products/{document=**} {
 *       allow read, write: if request.auth != null;
 *     }
 *     match /stock_by_location/{document=**} {
 *       allow read, write: if request.auth != null;
 *     }
 *     match /move_history/{document=**} {
 *       allow read, write: if request.auth != null;
 *     }
 *     match /categories/{document=**} {
 *       allow read: if request.auth != null;
 *     }
 *     match /warehouses/{document=**} {
 *       allow read, write: if request.auth != null;
 *     }
 *     match /users/{uid} {
 *       allow read, write: if request.auth.uid == uid;
 *     }
 *   }
 * }
 *
 * ENVIRONMENT VARIABLES NEEDED:
 *
 * NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
 * NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
 * NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
 * NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
 * NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
 * NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
 *
 * Add these to your Vercel environment variables or .env.local file
 */

import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function setupFirestore() {
  console.log("Setting up Firestore collections...")

  try {
    // Create sample categories
    const categoriesRef = collection(db, "categories")
    const categories = ["Electronics", "Textiles", "Furniture", "Food & Beverage", "Office Supplies"]

    for (const category of categories) {
      await addDoc(categoriesRef, {
        name: category,
        description: `${category} products`,
        createdAt: Timestamp.now(),
      })
    }
    console.log("✓ Categories created")

    // Create sample warehouses
    const warehousesRef = collection(db, "warehouses")
    const warehouses = [
      { name: "Main Warehouse", location: "New York", capacity: 10000 },
      { name: "North Distribution", location: "Boston", capacity: 5000 },
      { name: "South Distribution", location: "Miami", capacity: 5000 },
      { name: "East Fulfillment", location: "Philadelphia", capacity: 8000 },
      { name: "West Fulfillment", location: "Los Angeles", capacity: 12000 },
    ]

    for (const warehouse of warehouses) {
      await addDoc(warehousesRef, {
        ...warehouse,
        currentUtilization: 0,
        status: "active",
        createdAt: Timestamp.now(),
      })
    }
    console.log("✓ Warehouses created")

    // Create sample products
    const productsRef = collection(db, "products")
    const products = [
      {
        sku: "ELEC-001",
        name: "Wireless Mouse",
        category: "Electronics",
        description: "Ergonomic wireless mouse with 2.4GHz connection",
        price: 29.99,
        reorderMin: 50,
        status: "active",
      },
      {
        sku: "ELEC-002",
        name: "USB-C Cable",
        category: "Electronics",
        description: "High-speed USB-C charging cable",
        price: 9.99,
        reorderMin: 100,
        status: "active",
      },
      {
        sku: "TEXT-001",
        name: "Cotton T-Shirt",
        category: "Textiles",
        description: "100% organic cotton t-shirt, various sizes",
        price: 14.99,
        reorderMin: 100,
        status: "active",
      },
    ]

    for (const product of products) {
      await addDoc(productsRef, {
        ...product,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    }
    console.log("✓ Sample products created")

    console.log("Firestore setup complete!")
  } catch (error) {
    console.error("Error setting up Firestore:", error)
  }
}

// Uncomment to run setup
// setupFirestore();

export { setupFirestore }
