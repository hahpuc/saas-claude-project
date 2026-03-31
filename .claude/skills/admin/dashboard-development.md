# Admin Dashboard Development Skill

## When to Use
Use this skill for:
- Creating new admin pages and features
- Building forms, tables, and data displays
- Implementing filters, search, and pagination
- Dashboard widgets and statistics
- Layout and navigation changes

## Feature Development Workflow

### 1. Define Types First
```typescript
// types/user.types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  status?: UserStatus;
  sort?: string;
  order?: 'asc' | 'desc';
}
```

### 2. Create API Layer
```typescript
// api/users.api.ts
import { api } from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { User, UserListParams } from '../types/user.types';

export const usersApi = {
  list: (params: UserListParams) =>
    api.get<ApiResponse<PaginatedResponse<User>>>('/api/v1/users', { params }),

  detail: (id: string) =>
    api.get<ApiResponse<User>>(`/api/v1/users/${id}`),

  create: (data: CreateUserDto) =>
    api.post<ApiResponse<User>>('/api/v1/users', data),

  update: (id: string, data: UpdateUserDto) =>
    api.patch<ApiResponse<User>>(`/api/v1/users/${id}`, data),

  delete: (id: string) =>
    api.delete(`/api/v1/users/${id}`),
};
```

### 3. Create TanStack Query Hooks
```typescript
// hooks/use-users.ts
export function useUserList(params: UserListParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.list(params).then(r => r.data),
    staleTime: 30_000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    },
  });
}
```

### 4. Build the Table
```typescript
// components/users-table.tsx
const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name', cell: /* ... */ },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role', cell: /* badge component */ },
  { accessorKey: 'status', header: 'Status', cell: /* status badge */ },
  { accessorKey: 'createdAt', header: 'Created', cell: /* formatted date */ },
  { id: 'actions', cell: /* action dropdown menu */ },
];
```

### 5. Build the Form
```typescript
// schemas/user.schema.ts
export const createUserSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.nativeEnum(Role),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// components/user-form.tsx
export function UserForm({ onSubmit, defaultValues }: UserFormProps) {
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues,
  });
  // ... form fields using shadcn/ui Form components
}
```

## shadcn/ui Components Commonly Used
- `Table` — Data tables
- `Dialog` / `Sheet` — Modals and side panels
- `Form` + `Input` + `Select` — Forms
- `Button` — Actions
- `Badge` — Status indicators
- `DropdownMenu` — Action menus
- `Tabs` — Tabbed interfaces
- `Card` — Dashboard cards
- `Skeleton` — Loading states
- `Toast` — Notifications (via sonner)
- `Breadcrumb` — Navigation breadcrumbs
- `Pagination` — Page navigation

## Layout Structure
```
src/
├── layouts/
│   ├── admin.layout.tsx      # Main admin layout (sidebar + header + content)
│   ├── auth.layout.tsx       # Auth pages layout (centered card)
│   └── components/
│       ├── sidebar.tsx        # Navigation sidebar
│       ├── header.tsx         # Top header with user menu
│       └── breadcrumb.tsx     # Dynamic breadcrumbs
```
