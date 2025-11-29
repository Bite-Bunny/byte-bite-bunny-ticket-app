# API Layer Documentation

This directory contains the API layer for the application, following Next.js 15 and React Query best practices.

## Structure

```
core/api/
├── config.ts          # API configuration (baseURL, headers, timeout)
├── instance.ts        # Axios instance with interceptors
├── types.ts           # TypeScript types and utilities
├── services/          # API service functions
│   ├── user.service.ts
│   └── index.ts
└── index.ts           # Public API exports
```

## Usage

### 1. Creating API Services

Create service files in `core/api/services/`:

```typescript
// core/api/services/example.service.ts
import { apiClient } from '../instance'
import type { ApiResponse } from '../types'

export interface ExampleData {
  id: string
  name: string
}

export const exampleService = {
  getAll: async (): Promise<ExampleData[]> => {
    const response =
      await apiClient.get<ApiResponse<ExampleData[]>>('/api/examples')
    return response.data.data
  },

  getById: async (id: string): Promise<ExampleData> => {
    const response = await apiClient.get<ApiResponse<ExampleData>>(
      `/api/examples/${id}`,
    )
    return response.data.data
  },

  create: async (data: Omit<ExampleData, 'id'>): Promise<ExampleData> => {
    const response = await apiClient.post<ApiResponse<ExampleData>>(
      '/api/examples',
      data,
    )
    return response.data.data
  },

  update: async (
    id: string,
    data: Partial<ExampleData>,
  ): Promise<ExampleData> => {
    const response = await apiClient.patch<ApiResponse<ExampleData>>(
      `/api/examples/${id}`,
      data,
    )
    return response.data.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/examples/${id}`)
  },
}
```

### 2. Creating React Query Hooks

Create hook files in `shared/hooks/api/`:

```typescript
// shared/hooks/api/useExample.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  exampleService,
  type ExampleData,
} from '@/core/api/services/example.service'
import { getErrorMessage } from '@/core/api/types'

// Centralized query keys
export const exampleKeys = {
  all: ['example'] as const,
  lists: () => [...exampleKeys.all, 'list'] as const,
  list: (filters: string) => [...exampleKeys.lists(), { filters }] as const,
  details: () => [...exampleKeys.all, 'detail'] as const,
  detail: (id: string) => [...exampleKeys.details(), id] as const,
}

// Query hook
export function useExamples(filters?: string) {
  return useQuery({
    queryKey: exampleKeys.list(filters || ''),
    queryFn: exampleService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Single item query hook
export function useExample(id: string) {
  return useQuery({
    queryKey: exampleKeys.detail(id),
    queryFn: () => exampleService.getById(id),
    enabled: !!id,
  })
}

// Create mutation hook
export function useCreateExample() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: exampleService.create,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: exampleKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to create example:', getErrorMessage(error))
    },
  })
}

// Update mutation hook
export function useUpdateExample() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExampleData> }) =>
      exampleService.update(id, data),
    onSuccess: (data, variables) => {
      // Update cache directly
      queryClient.setQueryData(exampleKeys.detail(variables.id), data)
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: exampleKeys.lists() })
    },
  })
}

// Delete mutation hook
export function useDeleteExample() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: exampleService.delete,
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: exampleKeys.detail(id) })
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: exampleKeys.lists() })
    },
  })
}
```

### 3. Using Hooks in Components

```typescript
'use client'

import { useExamples, useCreateExample } from '@/shared/hooks/api/useExample'

export default function ExampleComponent() {
  const { data, isLoading, error } = useExamples()
  const createMutation = useCreateExample()

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        name: 'New Example',
      })
    } catch (error) {
      // Error is already handled in the mutation
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data?.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
      <button onClick={handleCreate}>Create</button>
    </div>
  )
}
```

## Best Practices

1. **Type Safety**: Always type your API responses and use TypeScript interfaces
2. **Query Keys**: Use centralized query keys for consistency and easier cache management
3. **Error Handling**: Use the `getErrorMessage` utility for consistent error messages
4. **Cache Management**: Properly invalidate or update cache after mutations
5. **Service Layer**: Keep API logic in services, not in components or hooks
6. **Interceptors**: Use axios interceptors for common concerns (auth, error handling)

## Error Handling

The axios instance includes interceptors that handle common errors. For custom error handling in hooks, use the `getErrorMessage` utility:

```typescript
import { getErrorMessage } from '@/core/api/types'

try {
  await someApiCall()
} catch (error) {
  const message = getErrorMessage(error)
  // Handle error
}
```

## Environment Variables

- `NEXT_PUBLIC_API_URL`: API base URL
- `NEXT_PUBLIC_MOCK_INIT_AUTH`: Mock auth token for development
- `NEXT_PUBLIC_QUERY_STALE_TIME_IN_MINUTES`: Default stale time for queries
