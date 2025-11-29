# Data Fetching Guide - Next.js 15 with React Query & Axios

This guide explains the clean data fetching architecture implemented in this Next.js 15 application.

## 🏗️ Architecture Overview

The data fetching layer follows a clean separation of concerns:

```
┌─────────────────────────────────────────┐
│         Components                      │
│  (use hooks, no direct API calls)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      React Query Hooks                   │
│  (shared/hooks/api/*.ts)                │
│  - useUser, useExamples, etc.            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      API Services                        │
│  (core/api/services/*.service.ts)       │
│  - userService, exampleService, etc.     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Axios Instance                      │
│  (core/api/instance.ts)                  │
│  - Interceptors, error handling          │
└─────────────────────────────────────────┘
```

## 📁 File Structure

```
src/
├── core/
│   └── api/
│       ├── config.ts              # API configuration
│       ├── instance.ts            # Axios instance with interceptors
│       ├── types.ts               # TypeScript types & utilities
│       ├── services/              # API service functions
│       │   ├── user.service.ts
│       │   └── index.ts
│       └── README.md              # Detailed API documentation
│
└── shared/
    ├── hooks/
    │   └── api/                   # React Query hooks
    │       ├── useUser.ts
    │       └── index.ts
    └── lib/
        └── query-client.ts        # React Query client setup
```

## 🚀 Quick Start

### 1. Create an API Service

```typescript
// src/core/api/services/inventory.service.ts
import { apiClient } from '../instance'
import type { ApiResponse } from '../types'

export interface InventoryItem {
  id: string
  type: string
  quantity: number
}

export const inventoryService = {
  getAll: async (): Promise<InventoryItem[]> => {
    const response =
      await apiClient.get<ApiResponse<InventoryItem[]>>('/api/inventory')
    return response.data.data
  },

  getById: async (id: string): Promise<InventoryItem> => {
    const response = await apiClient.get<ApiResponse<InventoryItem>>(
      `/api/inventory/${id}`,
    )
    return response.data.data
  },
}
```

### 2. Create React Query Hooks

```typescript
// src/shared/hooks/api/useInventory.ts
import { useQuery } from '@tanstack/react-query'
import {
  inventoryService,
  type InventoryItem,
} from '@/core/api/services/inventory.service'

export const inventoryKeys = {
  all: ['inventory'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
  detail: (id: string) => [...inventoryKeys.all, 'detail', id] as const,
}

export function useInventory() {
  return useQuery({
    queryKey: inventoryKeys.lists(),
    queryFn: inventoryService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useInventoryItem(id: string) {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: () => inventoryService.getById(id),
    enabled: !!id,
  })
}
```

### 3. Use in Components

```typescript
'use client'

import { useInventory } from '@/shared/hooks/api/useInventory'

export default function InventoryPage() {
  const { data, isLoading, error } = useInventory()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data?.map((item) => (
        <div key={item.id}>{item.type}</div>
      ))}
    </div>
  )
}
```

## ✨ Key Features

### ✅ Type Safety

- Full TypeScript support throughout
- Typed API responses
- Type-safe query keys

### ✅ Error Handling

- Global error interceptors
- Consistent error messages
- Type-safe error utilities

### ✅ Caching Strategy

- Automatic cache management
- Optimistic updates support
- Cache invalidation helpers

### ✅ Next.js 15 Optimized

- Server/client query client separation
- SSR-ready architecture
- No hydration mismatches

### ✅ Developer Experience

- Centralized query keys
- Reusable service layer
- Clean hook patterns

## 📝 Best Practices

1. **Always use services, never call axios directly in components**
2. **Use centralized query keys for consistency**
3. **Handle errors in mutations with `onError` callbacks**
4. **Invalidate related queries after mutations**
5. **Use TypeScript interfaces for all API responses**
6. **Keep services pure - no React hooks in services**

## 🔧 Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_MOCK_INIT_AUTH=mock-token
NEXT_PUBLIC_QUERY_STALE_TIME_IN_MINUTES=2
```

### Query Client Options

Configured in `src/shared/lib/query-client.ts`:

- Default stale time: 2 minutes (configurable)
- Refetch on window focus: disabled
- Retry: 1 attempt for queries, 0 for mutations
- Garbage collection time: 5 minutes

## 📚 Examples

See `src/core/api/README.md` for detailed examples including:

- CRUD operations
- Mutations with optimistic updates
- Error handling patterns
- Cache management strategies

## 🔄 Migration from Old Pattern

If you have existing code using the old pattern:

**Old:**

```typescript
const { data } = useQuery({
  queryKey: ['me'],
  queryFn: fetchMe,
})
```

**New:**

```typescript
const { data } = useUser()
```

The old `useMe` hook is still available but deprecated - it now uses the new `useUser` hook internally.
