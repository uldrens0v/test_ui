"use client";

import { useState } from "react";
import { TrendingUp, Users, CheckCircle, AlertCircle, ArrowUpRight, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const areaData = [
  { mes: "Ene", tareas: 30, bugs: 12 },
  { mes: "Feb", tareas: 45, bugs: 8 },
  { mes: "Mar", tareas: 38, bugs: 15 },
  { mes: "Abr", tareas: 60, bugs: 6 },
  { mes: "May", tareas: 55, bugs: 9 },
  { mes: "Jun", tareas: 72, bugs: 4 },
];

const barData = [
  { semana: "S1", completadas: 18, pendientes: 7 },
  { semana: "S2", completadas: 22, pendientes: 5 },
  { semana: "S3", completadas: 15, pendientes: 10 },
  { semana: "S4", completadas: 28, pendientes: 3 },
];

const chartConfig: ChartConfig = {
  tareas: { label: "Tareas", color: "hsl(var(--chart-1))" },
  bugs: { label: "Bugs", color: "hsl(var(--chart-2))" },
  completadas: { label: "Completadas", color: "hsl(var(--chart-3))" },
  pendientes: { label: "Pendientes", color: "hsl(var(--chart-4))" },
};

const recentActivity = [
  { user: "Ana García", avatar: "", initials: "AG", action: "Cerró el issue #42", time: "hace 5m", type: "success" },
  { user: "Carlos López", avatar: "", initials: "CL", action: "Abrió PR #87", time: "hace 12m", type: "info" },
  { user: "María Torres", avatar: "", initials: "MT", action: "Reportó bug crítico", time: "hace 1h", type: "destructive" },
  { user: "Luis Pérez", avatar: "", initials: "LP", action: "Deploy a producción", time: "hace 2h", type: "success" },
  { user: "Sara Ruiz", avatar: "", initials: "SR", action: "Actualizó documentación", time: "hace 3h", type: "info" },
  { user: "David Kim", avatar: "", initials: "DK", action: "Code review completado", time: "hace 4h", type: "success" },
];

const stats = [
  { title: "Tareas activas", value: "127", change: "+14%", icon: CheckCircle, trend: "up" },
  { title: "Miembros del equipo", value: "24", change: "+2", icon: Users, trend: "up" },
  { title: "Velocidad promedio", value: "87%", change: "+5%", icon: TrendingUp, trend: "up" },
  { title: "Incidentes abiertos", value: "3", change: "-2", icon: AlertCircle, trend: "down" },
];

export default function DashboardPage() {
  const [loadingStats, setLoadingStats] = useState(false);

  const handleRefresh = () => {
    setLoadingStats(true);
    setTimeout(() => {
      setLoadingStats(false);
      toast.success("Dashboard actualizado", { description: "Datos sincronizados correctamente." });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Resumen del proyecto — Sprint 12</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1">
            <Activity className="size-3" />
            En vivo
          </Badge>
          <Button size="sm" onClick={handleRefresh} disabled={loadingStats}>
            {loadingStats ? "Actualizando..." : "Actualizar"}
          </Button>
        </div>
      </div>

      {/* Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Recordatorio de sprint</AlertTitle>
        <AlertDescription>
          El Sprint 12 termina en <strong>3 días</strong>. Tienes 8 tareas pendientes por completar.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loadingStats
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))
          : stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs flex items-center gap-1 mt-1 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    <ArrowUpRight className={`size-3 ${stat.trend === "down" ? "rotate-180" : ""}`} />
                    {stat.change} este mes
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad del proyecto</CardTitle>
            <CardDescription>Tareas completadas vs bugs reportados (últimos 6 meses)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <AreaChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area type="monotone" dataKey="tareas" stroke="var(--color-tareas)" fill="var(--color-tareas)" fillOpacity={0.2} />
                <Area type="monotone" dataKey="bugs" stroke="var(--color-bugs)" fill="var(--color-bugs)" fillOpacity={0.2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <TrendingUp className="size-4 mr-1 text-green-500" /> Tendencia positiva — 18% más tareas completadas
          </CardFooter>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento semanal</CardTitle>
            <CardDescription>Tareas completadas vs pendientes por semana</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="completadas" fill="var(--color-completadas)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pendientes" fill="var(--color-pendientes)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Progress + Activity Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Sprint Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso del Sprint</CardTitle>
            <CardDescription>Sprint 12 — 3 días restantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Frontend", value: 78, color: "" },
              { label: "Backend", value: 62, color: "" },
              { label: "QA / Testing", value: 45, color: "" },
              { label: "Documentación", value: 90, color: "" },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
            <CardDescription>Últimas acciones del equipo</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[220px]">
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback className="text-xs">{item.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.user}</p>
                        <p className="text-xs text-muted-foreground">{item.action}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          variant={item.type === "success" ? "default" : item.type === "destructive" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {item.type === "success" ? "OK" : item.type === "destructive" ? "Bug" : "Info"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                      </div>
                    </div>
                    {i < recentActivity.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
