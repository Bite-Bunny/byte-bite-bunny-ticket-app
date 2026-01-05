# Application Architecture

High-level overview of the application structure and design patterns.

## Project Structure

```
byte-bite-bunny-ticket-app/
├── docs/                    # Documentation
│   ├── README.md
│   ├── 3D-MODELS.md
│   └── ARCHITECTURE.md
├── public/                  # Static assets
│   ├── models/             # 3D model files (GLB/GLTF)
│   ├── locales/            # Translation files
│   └── ...
├── src/
│   ├── app/                # Next.js app router pages
│   │   ├── inventory/
│   │   │   └── preview/    # 3D model preview page
│   │   └── ...
│   ├── core/               # Core application logic
│   │   ├── api/            # API client, services, WebSocket
│   │   └── i18n/           # Internationalization
│   ├── features/           # Feature modules
│   │   ├── preview-scene/  # 3D model rendering feature
│   │   ├── inventory/      # Inventory management
│   │   ├── home/           # Home page feature
│   │   └── ...
│   └── shared/             # Shared utilities and components
│       ├── components/     # Reusable React components
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Utility libraries
│       └── utils/          # Helper functions
└── ...
```

## Key Architectural Patterns

### Feature-Based Organization

The application follows a **feature-based architecture** where related functionality is grouped together:

```
features/
└── preview-scene/
    ├── components/      # Feature-specific components
    ├── hooks/           # Feature-specific hooks
    ├── utils/           # Feature-specific utilities
    ├── config/          # Feature configuration
    ├── types.ts         # Feature TypeScript types
    └── index.ts         # Public API exports
```

**Benefits:**

- Easy to locate related code
- Clear boundaries between features
- Reusable across the application
- Easy to test in isolation

### Separation of Concerns

#### 1. Presentation Layer (`components/`)

- React components for UI
- No business logic
- Receives props, emits events

#### 2. Business Logic Layer (`hooks/`, `utils/`)

- Custom hooks for reusable logic
- Utility functions
- Data transformation

#### 3. Data Layer (`core/api/`)

- API service functions
- React Query hooks
- WebSocket connections

#### 4. Configuration Layer (`config/`)

- Default settings
- Constants
- Environment-specific configs

## Technology Stack

### Core Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **React Three Fiber** - 3D rendering
- **@react-three/drei** - 3D helpers and utilities
- **React Query** - Server state management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

### Key Libraries

- **Three.js** - 3D graphics library
- **@tanstack/react-query** - Data fetching and caching
- **next-intl** - Internationalization
- **@tonconnect/ui-react** - TON Connect integration

## Design Patterns

### 1. Custom Hooks Pattern

Encapsulate reusable logic in custom hooks:

```tsx
// ✅ Good - Logic in hook
function useModelPreload(modelPath: string) {
  useEffect(() => {
    getCachedModel(modelPath)
  }, [modelPath])
}

// Component uses hook
function Component() {
  useModelPreload('/models/model.glb')
  return <PreviewScene modelPath="/models/model.glb" />
}
```

### 2. Service Layer Pattern

Separate API calls from components:

```tsx
// Service
export const userService = {
  getMe: () => apiClient.get('/api/user/me'),
}

// Hook
export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: userService.getMe,
  })
}

// Component
function Component() {
  const { data } = useUser()
}
```

### 3. Configuration Pattern

Centralize configuration:

```tsx
// config/preview.config.ts
export const DEFAULT_CAMERA_CONFIG = {
  position: [0, 1.2, 5.5],
  fov: 50,
}

// Component
import { DEFAULT_CAMERA_CONFIG } from '@/features/preview-scene/config'
```

### 4. Public API Pattern

Export only what's needed from features:

```tsx
// features/preview-scene/index.ts
export { PreviewScene } from './components'
export { useModelPreload } from './hooks'
export * from './types'

// Usage - clean imports
import { PreviewScene, useModelPreload } from '@/features/preview-scene'
```

## Data Flow

### 3D Model Rendering Flow

```
1. App Initialization
   └─> Providers.tsx preloads models

2. Component Renders
   └─> useModelPreload() preloads model
   └─> PreviewScene component mounts

3. Model Loading
   └─> Model3D uses useGLTF()
   └─> Checks cache → loads if needed
   └─> Clones and processes model

4. Rendering
   └─> Model is centered and scaled
   └─> Rendered in Three.js Canvas
   └─> Controls enabled for interaction
```

### API Data Flow

```
1. Component
   └─> Calls custom hook (useUser)

2. React Query Hook
   └─> Calls service function (userService.getMe)

3. API Service
   └─> Uses Axios instance (apiClient)
   └─> Interceptors handle auth/errors

4. Response
   └─> React Query caches response
   └─> Component receives data
```

## Caching Strategy

### Dual Caching for 3D Models

1. **Custom Cache** (`cache-model.ts`)
   - App-wide model storage
   - Can be used outside React
   - Manual control

2. **drei Cache** (`useGLTF`)
   - React Three Fiber integration
   - Automatic caching
   - Works with drei components

**Why Both?**

- Custom cache for app-wide optimization
- drei cache for seamless R3F integration
- Redundant caching ensures fast loads

### React Query Caching

- Automatic cache management
- Stale time: 2 minutes (configurable)
- Garbage collection: 5 minutes
- Optimistic updates support

## State Management

### Server State

- **React Query** - All server data
- Automatic caching and synchronization
- Optimistic updates

### Client State

- **React useState/useReducer** - Component state
- **URL/Query params** - Navigation state
- **Context API** - Shared app state (if needed)

## Error Handling

### API Errors

- Global interceptors in Axios
- React Query error boundaries
- Consistent error messages

### 3D Model Errors

- Try-catch in preload utilities
- Suspense boundaries for rendering
- Fallback UI components

## Performance Optimizations

### 3D Models

- Model preloading
- Dual caching system
- Resource disposal on unmount
- Automatic scaling and centering

### React

- Code splitting (Next.js automatic)
- Lazy loading for heavy components
- Memoization where needed
- React Query automatic caching

### Build

- Next.js optimization
- Tree shaking
- Asset optimization

## Testing Strategy

### Unit Tests

- Utilities and pure functions
- Custom hooks
- Service functions

### Integration Tests

- Component rendering
- API integration
- Feature workflows

### E2E Tests

- Critical user flows
- 3D model interactions
- Navigation

## Best Practices

### Code Organization

1. ✅ Group by feature, not by type
2. ✅ Keep features self-contained
3. ✅ Export clean public APIs
4. ✅ Use TypeScript for type safety

### Component Design

1. ✅ Small, focused components
2. ✅ Extract logic to hooks
3. ✅ Use composition over inheritance
4. ✅ Prop types with TypeScript

### Performance

1. ✅ Preload critical assets
2. ✅ Use React Query for server state
3. ✅ Optimize 3D model loading
4. ✅ Lazy load heavy components

### Maintainability

1. ✅ Consistent naming conventions
2. ✅ Clear file structure
3. ✅ Comprehensive documentation
4. ✅ Type safety everywhere

## Future Considerations

### Potential Improvements

- [ ] Add more 3D model formats support
- [ ] Implement model compression
- [ ] Add animation support
- [ ] WebSocket real-time updates
- [ ] Progressive web app features
- [ ] Enhanced error boundaries
- [ ] Performance monitoring
- [ ] Accessibility improvements

---

For more specific documentation, see:

- [3D Models Guide](./3D-MODELS.md)
- [Data Fetching Guide](../DATA_FETCHING_GUIDE.md)
