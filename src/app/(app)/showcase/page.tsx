"use client";

import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const carouselSlides = [
  { title: "Componentes de Overlay", desc: "Dialog, Sheet, Drawer, AlertDialog, Popover", color: "from-blue-500 to-indigo-600" },
  { title: "Formularios completos", desc: "Input, Select, Checkbox, Radio, Slider, Switch, OTP", color: "from-purple-500 to-pink-600" },
  { title: "Data Display", desc: "Table, Chart, Card, Badge, Avatar, Progress", color: "from-green-500 to-teal-600" },
  { title: "Navegación", desc: "Sidebar, Menubar, Navigation Menu, Breadcrumb, Tabs", color: "from-orange-500 to-red-600" },
];

export default function ShowcasePage() {
  const [page, setPage] = useState(1);
  const totalPages = 8;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Showcase de componentes</h1>
        <p className="text-muted-foreground text-sm">Demostración de componentes adicionales de shadcn/ui.</p>
      </div>

      {/* Menubar */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Menubar</h2>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Archivo</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Nuevo proyecto <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
              <MenubarItem>Abrir... <MenubarShortcut>⌘O</MenubarShortcut></MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Exportar como</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>PDF</MenubarItem>
                  <MenubarItem>CSV</MenubarItem>
                  <MenubarItem>JSON</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem>Cerrar <MenubarShortcut>⌘W</MenubarShortcut></MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Editar</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Deshacer <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
              <MenubarItem>Rehacer <MenubarShortcut>⌘Y</MenubarShortcut></MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Cortar <MenubarShortcut>⌘X</MenubarShortcut></MenubarItem>
              <MenubarItem>Copiar <MenubarShortcut>⌘C</MenubarShortcut></MenubarItem>
              <MenubarItem>Pegar <MenubarShortcut>⌘V</MenubarShortcut></MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Vista</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Modo compacto</MenubarItem>
              <MenubarItem>Pantalla completa <MenubarShortcut>F11</MenubarShortcut></MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Ayuda</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Documentación</MenubarItem>
              <MenubarItem>Atajos de teclado</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Acerca de DevBoard</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </section>

      <Separator />

      {/* Navigation Menu */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Navigation Menu</h2>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Productos</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                  {[
                    { title: "Dashboard", desc: "Resumen visual del proyecto" },
                    { title: "Analytics", desc: "Métricas y reportes avanzados" },
                    { title: "Integrations", desc: "Conecta con tus herramientas" },
                    { title: "API", desc: "Acceso programático completo" },
                  ].map(({ title, desc }) => (
                    <li key={title}>
                      <NavigationMenuLink className="block p-3 rounded-md hover:bg-accent cursor-pointer">
                        <p className="font-medium text-sm">{title}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Recursos</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-3 p-4">
                  {["Documentación", "Blog", "Comunidad", "Changelog"].map((item) => (
                    <li key={item}>
                      <NavigationMenuLink className="block p-2 rounded-md hover:bg-accent cursor-pointer text-sm">
                        {item}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2 text-sm cursor-pointer hover:bg-accent rounded-md">
                Precios
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </section>

      <Separator />

      {/* Carousel */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Carousel</h2>
        <Carousel className="w-full max-w-2xl mx-auto">
          <CarouselContent>
            {carouselSlides.map((slide, i) => (
              <CarouselItem key={i}>
                <Card className={`bg-gradient-to-br ${slide.color} text-white border-0`}>
                  <CardHeader>
                    <CardTitle className="text-white">{slide.title}</CardTitle>
                    <CardDescription className="text-white/80">{slide.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/70">Slide {i + 1} de {carouselSlides.length}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      <Separator />

      {/* Resizable panels */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Resizable panels</h2>
        <ResizablePanelGroup orientation="horizontal" className="min-h-48 rounded-lg border">
          <ResizablePanel defaultSize={30} minSize={20}>
            <div className="flex flex-col h-full p-4">
              <p className="font-medium text-sm mb-2">Sidebar</p>
              <ScrollArea className="flex-1">
                {["Inbox", "Starred", "Sent", "Drafts", "Trash", "Spam", "Archive"].map((item) => (
                  <div key={item} className="py-1.5 px-2 rounded text-sm hover:bg-muted cursor-pointer">{item}</div>
                ))}
              </ScrollArea>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70}>
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize={60}>
                <div className="p-4 h-full">
                  <p className="font-medium text-sm mb-2">Contenido principal</p>
                  <p className="text-xs text-muted-foreground">Arrastra los separadores para redimensionar los paneles. Este componente es útil para layouts tipo IDE o paneles de administración.</p>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={40}>
                <div className="p-4 h-full">
                  <p className="font-medium text-sm mb-2">Panel inferior</p>
                  <p className="text-xs text-muted-foreground font-mono">Console output...</p>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </section>

      <Separator />

      {/* Context Menu + AspectRatio + Skeleton */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Context Menu · Aspect Ratio · Skeleton</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Context menu */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Context Menu</CardTitle>
              <CardDescription className="text-xs">Haz clic derecho en el área de abajo</CardDescription>
            </CardHeader>
            <CardContent>
              <ContextMenu>
                <ContextMenuTrigger className="flex h-24 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                  Clic derecho aquí
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuLabel>Acciones</ContextMenuLabel>
                  <ContextMenuItem onClick={() => toast("Copiado")} >
                    Copiar <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => toast("Pegado")}>
                    Pegar <ContextMenuShortcut>⌘V</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem className="text-destructive" onClick={() => toast.error("Eliminado")}>
                    Eliminar <ContextMenuShortcut>Del</ContextMenuShortcut>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </CardContent>
          </Card>

          {/* Aspect Ratio */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Aspect Ratio (16/9)</CardTitle>
              <CardDescription className="text-xs">Mantiene la proporción de la imagen</CardDescription>
            </CardHeader>
            <CardContent>
              <AspectRatio ratio={16 / 9} className="bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-md overflow-hidden">
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">16:9</p>
                </div>
              </AspectRatio>
            </CardContent>
          </Card>

          {/* Skeleton */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Skeleton (loading state)</CardTitle>
              <CardDescription className="text-xs">Placeholder mientras carga el contenido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
              <Skeleton className="h-16 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Pagination */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Pagination</h2>
          <span className="text-sm text-muted-foreground">Página {page} de {totalPages}</span>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} className="cursor-pointer" />
            </PaginationItem>
            {[1, 2, 3].map((p) => (
              <PaginationItem key={p}>
                <PaginationLink onClick={() => setPage(p)} isActive={page === p} className="cursor-pointer">{p}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem><PaginationEllipsis /></PaginationItem>
            {[7, 8].map((p) => (
              <PaginationItem key={p}>
                <PaginationLink onClick={() => setPage(p)} isActive={page === p} className="cursor-pointer">{p}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="cursor-pointer" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>

      <Separator />

      {/* Badges showcase */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Badges — todas las variantes</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>default</Badge>
          <Badge variant="secondary">secondary</Badge>
          <Badge variant="outline">outline</Badge>
          <Badge variant="destructive">destructive</Badge>
          <Badge className="bg-green-500 hover:bg-green-600">success</Badge>
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">warning</Badge>
          <Badge className="bg-blue-500 hover:bg-blue-600">info</Badge>
          <Badge className="bg-purple-500 hover:bg-purple-600">purple</Badge>
        </div>
      </section>

      <Separator />

      {/* Buttons showcase */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Buttons — todas las variantes</h2>
        <Tabs defaultValue="variants">
          <TabsList>
            <TabsTrigger value="variants">Variantes</TabsTrigger>
            <TabsTrigger value="sizes">Tamaños</TabsTrigger>
            <TabsTrigger value="states">Estados</TabsTrigger>
          </TabsList>
          <TabsContent value="variants" className="flex flex-wrap gap-2 mt-3">
            <Button>default</Button>
            <Button variant="secondary">secondary</Button>
            <Button variant="destructive">destructive</Button>
            <Button variant="outline">outline</Button>
            <Button variant="ghost">ghost</Button>
            <Button variant="link">link</Button>
          </TabsContent>
          <TabsContent value="sizes" className="flex flex-wrap items-center gap-2 mt-3">
            <Button size="lg">Large</Button>
            <Button>Default</Button>
            <Button size="sm">Small</Button>
            <Button size="icon">+</Button>
          </TabsContent>
          <TabsContent value="states" className="flex flex-wrap gap-2 mt-3">
            <Button disabled>Disabled</Button>
            <Button onClick={() => toast("Clic registrado")}>Con acción</Button>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
