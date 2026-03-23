@AGENTS.md

# DevBoard — Contexto del proyecto

App de demostración de componentes shadcn/ui, estilo "project management dashboard".

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- shadcn/ui v4 → usa `@base-ui/react` (NO Radix), ver sección crítica abajo
- lucide-react, date-fns, sonner, recharts, @supabase/supabase-js (pendiente)

## Estructura de rutas
```
src/app/(app)/             ← layout con sidebar
  page.tsx                 → / Dashboard (Charts, Stats, Progress, Alert, Skeleton)
  team/page.tsx            → /team (Table, Dialog, Sheet, Drawer, DropdownMenu, AlertDialog)
  tasks/page.tsx           → /tasks (Calendar, Accordion, HoverCard, Combobox, Collapsible)
  notifications/page.tsx   → /notifications (Alert, Switch, Sonner demo)
  settings/page.tsx        → /settings (Slider, Select, RadioGroup, InputOTP, Toggle, ToggleGroup)
  showcase/page.tsx        → /showcase (Carousel, Resizable, ContextMenu, NavigationMenu, Menubar…)
src/components/
  app-sidebar.tsx          ← Sidebar con navegación
  page-header.tsx          ← Breadcrumb + SidebarTrigger
```

## CRÍTICO: base-ui NO usa asChild

shadcn/ui v4 usa `@base-ui/react`. La diferencia principal con Radix:
- **No existe `asChild`** → usar `render={<Componente props />}` en su lugar
- Ejemplos:
  ```tsx
  // ❌ Radix (no funciona)
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>

  // ✅ base-ui
  <DialogTrigger render={<Button />}>Open</DialogTrigger>
  ```
- Aplica a: PopoverTrigger, CollapsibleTrigger, SheetTrigger, DialogTrigger,
  DropdownMenuTrigger, AlertDialogTrigger, TooltipTrigger, HoverCardTrigger,
  SidebarMenuButton, BreadcrumbLink

## Otras diferencias de API base-ui
- `Select.onValueChange` → `(v: string | null) => void` — siempre guardar con `v && ...`
- `Slider.onValueChange` → `(v: number | readonly number[]) => void`
- `ToggleGroup.value` → `readonly string[]` (siempre array), `onValueChange(v: string[]) => void`
- `Accordion` → usa `multiple={true}` en vez de `type="multiple"`
- `ResizablePanelGroup` → usa `orientation` no `direction` (react-resizable-panels v4)
- `NavigationMenuLink` → no tiene `asChild`, añadir `className` directamente

## Pendiente: integración con Supabase
- Instalar `@supabase/supabase-js`
- Crear `src/lib/supabase.ts` con el cliente
- Crear `.env.local` con `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Tablas a crear en Supabase:
  - `members` (id, name, email, role, status, tasks_count, joined_at)
  - `tasks` (id, title, description, done, priority, category, due_date, assignee)
  - `notifications` (id, type, title, body, read, created_at)
- Conectar páginas /team, /tasks y /notifications con datos reales
