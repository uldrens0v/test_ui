"use client";

import { useState } from "react";
import { Bell, CheckCheck, Trash2, Info, AlertTriangle, CheckCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type NotifType = "info" | "success" | "warning" | "message";

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  initials: string;
}

const initialNotifs: Notification[] = [
  { id: 1, type: "message", title: "Carlos López", body: "PR #87 está listo para revisión", time: "5 min", read: false, initials: "CL" },
  { id: 2, type: "warning", title: "Deploy fallido", body: "El pipeline de staging falló en el paso de tests", time: "23 min", read: false, initials: "CI" },
  { id: 3, type: "success", title: "Deploy exitoso", body: "La versión 2.4.1 fue desplegada en producción", time: "1h", read: false, initials: "CD" },
  { id: 4, type: "info", title: "Nuevo miembro", body: "Andrés Mora se unió al workspace", time: "3h", read: true, initials: "AM" },
  { id: 5, type: "message", title: "Ana García", body: "¿Puedes revisar el diseño del onboarding?", time: "5h", read: true, initials: "AG" },
  { id: 6, type: "success", title: "Tarea completada", body: "Luis Pérez cerró la tarea #42 «Migración de BD»", time: "1d", read: true, initials: "LP" },
];

const typeIcon: Record<NotifType, React.ReactNode> = {
  info: <Info className="size-4 text-blue-500" />,
  success: <CheckCircle className="size-4 text-green-500" />,
  warning: <AlertTriangle className="size-4 text-yellow-500" />,
  message: <MessageSquare className="size-4 text-purple-500" />,
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>(initialNotifs);
  const [prefs, setPrefs] = useState({
    deploys: true,
    mentions: true,
    tasks: false,
    security: true,
    weekly: false,
  });

  const unread = notifs.filter((n) => !n.read).length;

  const markAll = () => {
    setNotifs((p) => p.map((n) => ({ ...n, read: true })));
    toast.success("Todas marcadas como leídas");
  };

  const markRead = (id: number) => setNotifs((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id: number) => {
    setNotifs((p) => p.filter((n) => n.id !== id));
    toast("Notificación eliminada");
  };

  const testToast = (variant: string) => {
    if (variant === "success") toast.success("Operación completada", { description: "Todo salió bien." });
    if (variant === "error") toast.error("Error inesperado", { description: "Intenta de nuevo más tarde." });
    if (variant === "warning") toast.warning("Atención", { description: "Esta acción podría tener consecuencias." });
    if (variant === "info") toast.info("Información", { description: "Nuevo sprint disponible." });
    if (variant === "promise") {
      toast.promise(new Promise((res) => setTimeout(res, 2000)), {
        loading: "Guardando cambios...",
        success: "Cambios guardados",
        error: "Error al guardar",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notificaciones</h1>
          <p className="text-muted-foreground text-sm">{unread} sin leer</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAll} disabled={unread === 0}>
          <CheckCheck className="size-4 mr-1" /> Marcar todas como leídas
        </Button>
      </div>

      {/* Alert examples */}
      <div className="space-y-3">
        <Alert>
          <Info className="size-4" />
          <AlertTitle>Actualización disponible</AlertTitle>
          <AlertDescription>La versión 3.0.0 de DevBoard está disponible con nuevas funcionalidades.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sesión por expirar</AlertTitle>
          <AlertDescription>Tu sesión expirará en 10 minutos. Guarda tu trabajo antes de que se cierre.</AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="notifs">
        <TabsList>
          <TabsTrigger value="notifs" className="gap-1">
            Centro de notificaciones
            {unread > 0 && <Badge className="h-5 px-1.5 text-xs">{unread}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="prefs">Preferencias</TabsTrigger>
          <TabsTrigger value="toast">Toast demo</TabsTrigger>
        </TabsList>

        <TabsContent value="notifs" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[380px]">
                {notifs.map((notif, i) => (
                  <div key={notif.id}>
                    <div
                      className={`flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors ${!notif.read ? "bg-muted/20" : ""}`}
                    >
                      <Avatar className="size-9 mt-0.5">
                        <AvatarFallback className="text-xs">{notif.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {typeIcon[notif.type]}
                          <p className="text-sm font-medium">{notif.title}</p>
                          {!notif.read && <div className="size-2 rounded-full bg-primary ml-auto" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{notif.body}</p>
                        <p className="text-xs text-muted-foreground mt-1">Hace {notif.time}</p>
                      </div>
                      <div className="flex gap-1">
                        {!notif.read && (
                          <Button variant="ghost" size="icon" className="size-7" onClick={() => markRead(notif.id)}>
                            <CheckCircle className="size-3.5" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" onClick={() => deleteNotif(notif.id)}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                    {i < notifs.length - 1 && <Separator />}
                  </div>
                ))}
                {notifs.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <Bell className="size-10 mb-2 opacity-30" />
                    <p className="text-sm">No hay notificaciones</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prefs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de notificación</CardTitle>
              <CardDescription>Controla qué notificaciones quieres recibir.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "deploys" as const, label: "Deploys y CI/CD", desc: "Notificaciones de pipelines y despliegues" },
                { key: "mentions" as const, label: "Menciones", desc: "Cuando alguien te menciona en comentarios" },
                { key: "tasks" as const, label: "Actualizaciones de tareas", desc: "Cambios en tareas asignadas" },
                { key: "security" as const, label: "Alertas de seguridad", desc: "Vulnerabilidades y accesos sospechosos" },
                { key: "weekly" as const, label: "Resumen semanal", desc: "Email con el resumen del sprint cada lunes" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={key} className="font-medium">{label}</Label>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    id={key}
                    checked={prefs[key]}
                    onCheckedChange={(v) => {
                      setPrefs((p) => ({ ...p, [key]: v }));
                      toast(v ? `${label} activado` : `${label} desactivado`);
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="toast" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Demo de Toast / Sonner</CardTitle>
              <CardDescription>Prueba los diferentes tipos de notificaciones toast.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button onClick={() => testToast("success")} className="bg-green-600 hover:bg-green-700">Success</Button>
              <Button onClick={() => testToast("error")} variant="destructive">Error</Button>
              <Button onClick={() => testToast("warning")} className="bg-yellow-500 hover:bg-yellow-600 text-black">Warning</Button>
              <Button onClick={() => testToast("info")} variant="secondary">Info</Button>
              <Button onClick={() => testToast("promise")} variant="outline">Promise</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
