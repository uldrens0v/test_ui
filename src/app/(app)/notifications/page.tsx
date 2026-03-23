"use client";

import { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type NotifType = "info" | "success" | "warning" | "message";
type Notification = Database["public"]["Tables"]["notifications"]["Row"];

function getInitials(title: string) {
  return title.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

const typeIcon: Record<NotifType, React.ReactNode> = {
  info: <Info className="size-4 text-blue-500" />,
  success: <CheckCircle className="size-4 text-green-500" />,
  warning: <AlertTriangle className="size-4 text-yellow-500" />,
  message: <MessageSquare className="size-4 text-purple-500" />,
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState({
    deploys: true,
    mentions: true,
    tasks: false,
    security: true,
    weekly: false,
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Error cargando notificaciones");
    else setNotifs(data ?? []);
    setLoading(false);
  }

  const unread = notifs.filter((n) => !n.read).length;

  const markAll = async () => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("read", false);
    if (error) { toast.error("Error al marcar notificaciones"); return; }
    setNotifs((p) => p.map((n) => ({ ...n, read: true })));
    toast.success("Todas marcadas como leídas");
  };

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifs((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotif = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
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
                {loading ? (
                  <div className="p-4 space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="size-9 rounded-full shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  notifs.map((notif, i) => (
                    <div key={notif.id}>
                      <div className={`flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors ${!notif.read ? "bg-muted/20" : ""}`}>
                        <Avatar className="size-9 mt-0.5">
                          <AvatarFallback className="text-xs">{getInitials(notif.title)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {typeIcon[notif.type as NotifType] ?? typeIcon.info}
                            <p className="text-sm font-medium">{notif.title}</p>
                            {!notif.read && <div className="size-2 rounded-full bg-primary ml-auto" />}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{notif.body}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Hace {formatDistanceToNow(new Date(notif.created_at), { locale: es })}
                          </p>
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
                  ))
                )}
                {!loading && notifs.length === 0 && (
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
