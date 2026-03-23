"use client";

import { useState } from "react";
import { MoreHorizontal, UserPlus, Search, Mail, Shield, Trash2, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter } from "@/components/ui/drawer";
import { toast } from "sonner";

const roles = ["Admin", "Developer", "Designer", "QA", "Product"] as const;
type Role = typeof roles[number];

interface Member {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: "Activo" | "Inactivo" | "Vacaciones";
  initials: string;
  tasks: number;
  joined: string;
}

const initialMembers: Member[] = [
  { id: 1, name: "Ana García", email: "ana@devboard.io", role: "Admin", status: "Activo", initials: "AG", tasks: 12, joined: "2023-01-15" },
  { id: 2, name: "Carlos López", email: "carlos@devboard.io", role: "Developer", status: "Activo", initials: "CL", tasks: 8, joined: "2023-03-20" },
  { id: 3, name: "María Torres", email: "maria@devboard.io", role: "Designer", status: "Vacaciones", initials: "MT", tasks: 3, joined: "2023-05-10" },
  { id: 4, name: "Luis Pérez", email: "luis@devboard.io", role: "Developer", status: "Activo", initials: "LP", tasks: 15, joined: "2022-11-08" },
  { id: 5, name: "Sara Ruiz", email: "sara@devboard.io", role: "QA", status: "Activo", initials: "SR", tasks: 6, joined: "2023-07-01" },
  { id: 6, name: "David Kim", email: "david@devboard.io", role: "Product", status: "Inactivo", initials: "DK", tasks: 0, joined: "2022-09-14" },
];

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  Activo: "default",
  Vacaciones: "secondary",
  Inactivo: "outline",
};

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "Developer" as Role });

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      toast.error("Completa todos los campos");
      return;
    }
    const m: Member = {
      id: Date.now(),
      ...newMember,
      status: "Activo",
      initials: newMember.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
      tasks: 0,
      joined: new Date().toISOString().split("T")[0],
    };
    setMembers((prev) => [...prev, m]);
    setNewMember({ name: "", email: "", role: "Developer" });
    toast.success(`${m.name} agregado al equipo`);
  };

  const handleDelete = (id: number) => {
    const m = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success(`${m?.name} eliminado del equipo`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Equipo</h1>
          <p className="text-muted-foreground text-sm">{members.length} miembros en total</p>
        </div>
        <div className="flex gap-2">
          {/* Sheet para invitar */}
          <Sheet>
            <SheetTrigger render={<Button variant="outline" size="sm" />}>
              <Mail className="size-4 mr-1" /> Invitar
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Invitar por email</SheetTitle>
                <SheetDescription>Envía una invitación al workspace de DevBoard.</SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input placeholder="usuario@empresa.com" />
                </div>
                <div className="space-y-2">
                  <Label>Rol</Label>
                  <Select defaultValue="Developer">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter>
                <Button onClick={() => toast.success("Invitación enviada")}>Enviar invitación</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Dialog para agregar */}
          <Dialog>
            <DialogTrigger render={<Button size="sm" />}>
              <UserPlus className="size-4 mr-1" /> Agregar miembro
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo miembro</DialogTitle>
                <DialogDescription>Agrega un nuevo integrante al equipo.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Nombre completo</Label>
                  <Input
                    value={newMember.name}
                    onChange={(e) => setNewMember((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Juan Rodríguez"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember((p) => ({ ...p, email: e.target.value }))}
                    placeholder="juan@devboard.io"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Rol</Label>
                  <Select value={newMember.role} onValueChange={(v) => setNewMember((p) => ({ ...p, role: v as Role }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddMember}>Agregar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Buscar miembro..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Miembro</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Tareas</TableHead>
              <TableHead className="text-right">Se unió</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarImage src="" />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="gap-1 text-xs">
                    {member.role === "Admin" && <Shield className="size-3" />}
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[member.status]}>{member.status}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">{member.tasks}</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">{member.joined}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSelectedMember(member)}>
                        <Eye className="size-4 mr-2" /> Ver perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="size-4 mr-2" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteTarget(member)}
                      >
                        <Trash2 className="size-4 mr-2" /> Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No se encontraron miembros
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Drawer para ver perfil */}
      {selectedMember && (
        <Drawer open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Perfil de {selectedMember.name}</DrawerTitle>
              <DrawerDescription>{selectedMember.email}</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-4 space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarFallback className="text-xl">{selectedMember.initials}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{selectedMember.name}</h3>
                  <Badge variant="outline">{selectedMember.role}</Badge>
                  <Badge variant={statusVariant[selectedMember.status]} className="ml-1">{selectedMember.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Tareas activas</span><p className="font-bold text-lg">{selectedMember.tasks}</p></div>
                <div><span className="text-muted-foreground">Miembro desde</span><p className="font-medium">{selectedMember.joined}</p></div>
              </div>
            </div>
            <DrawerFooter>
              <Button variant="outline" onClick={() => setSelectedMember(null)}>Cerrar</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}

      {/* AlertDialog controlado para eliminar */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar a {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El miembro perderá acceso al workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) {
                  handleDelete(deleteTarget.id);
                  setDeleteTarget(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Tooltips demo */}
      <div className="flex gap-2 items-center text-sm text-muted-foreground">
        <span>Acciones rápidas:</span>
        {[{ icon: Shield, label: "Gestionar permisos" }, { icon: Mail, label: "Enviar comunicado" }, { icon: UserPlus, label: "Importar miembros" }].map(({ icon: Icon, label }) => (
          <Tooltip key={label}>
            <TooltipTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>
              <Icon className="size-4" />
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
