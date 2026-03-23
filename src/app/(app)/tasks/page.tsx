"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Plus, Filter, Tag, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type Priority = "Alta" | "Media" | "Baja";
type Category = "Frontend" | "Backend" | "Diseño" | "QA" | "DevOps";
type Task = Database["public"]["Tables"]["tasks"]["Row"];
type Member = Pick<Database["public"]["Tables"]["members"]["Row"], "id" | "name">;

const categories: Category[] = ["Frontend", "Backend", "Diseño", "QA", "DevOps"];

const priorityColor: Record<Priority, "destructive" | "default" | "secondary"> = {
  Alta: "destructive",
  Media: "default",
  Baja: "secondary",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [filterOpen, setFilterOpen] = useState(false);
  const [comboOpen, setComboOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [{ data: tasksData, error: tasksError }, { data: membersData }] = await Promise.all([
      supabase.from("tasks").select("*").order("due_date", { ascending: true, nullsFirst: false }),
      supabase.from("members").select("id, name").order("name"),
    ]);
    if (tasksError) toast.error("Error cargando tareas");
    setTasks(tasksData ?? []);
    setMembers(membersData ?? []);
    setLoading(false);
  }

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const { error } = await supabase.from("tasks").update({ done: !task.done }).eq("id", id);
    if (error) { toast.error("Error al actualizar tarea"); return; }
    setTasks((prev) => prev.map((t) => {
      if (t.id === id) { toast(t.done ? "Tarea reabierta" : "Tarea completada ✓"); return { ...t, done: !t.done }; }
      return t;
    }));
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title: newTask,
        description: "Sin descripción",
        done: false,
        priority: "Media",
        category: "Frontend",
        due_date: date ? format(date, "yyyy-MM-dd") : null,
        assignee: selectedMember?.name ?? "Sin asignar",
        member_id: selectedMember?.id ?? null,
      })
      .select()
      .single();
    if (error) { toast.error("Error al crear tarea"); return; }
    setTasks((prev) => [...prev, data]);
    setNewTask("");
    setDate(undefined);
    setSelectedMember(null);
    toast.success("Tarea creada exitosamente");
  };

  const pending = tasks.filter((t) => !t.done);
  const completed = tasks.filter((t) => t.done);
  const byCategory = categories
    .map((c) => ({ category: c, tasks: pending.filter((t) => t.category === c) }))
    .filter((g) => g.tasks.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tareas</h1>
          <p className="text-muted-foreground text-sm">{pending.length} pendientes · {completed.length} completadas</p>
        </div>
      </div>

      {/* Add task bar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Nueva tarea</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Input
              className="flex-1 min-w-48"
              placeholder="Describe la tarea..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />

            {/* Date Picker */}
            <Popover>
              <PopoverTrigger render={<Button variant="outline" className="gap-2" />}>
                <CalendarIcon className="size-4" />
                {date ? format(date, "dd MMM", { locale: es }) : "Fecha"}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>

            {/* Combobox assignee (desde members de BD) */}
            <Popover open={comboOpen} onOpenChange={setComboOpen}>
              <PopoverTrigger render={<Button variant="outline" className="gap-2" />}>
                {selectedMember?.name ?? "Asignar a..."}
              </PopoverTrigger>
              <PopoverContent className="w-52 p-0">
                <Command>
                  <CommandInput placeholder="Buscar persona..." />
                  <CommandList>
                    <CommandEmpty>Sin resultados</CommandEmpty>
                    <CommandGroup>
                      {members.map((m) => (
                        <CommandItem
                          key={m.id}
                          value={m.name}
                          onSelect={() => { setSelectedMember(m); setComboOpen(false); }}
                        >
                          {m.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button onClick={addTask}>
              <Plus className="size-4 mr-1" /> Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs view */}
      <Tabs defaultValue="lista">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="lista">Lista</TabsTrigger>
            <TabsTrigger value="categoria">Por categoría</TabsTrigger>
            <TabsTrigger value="calendario">Calendario</TabsTrigger>
          </TabsList>

          <Collapsible open={filterOpen} onOpenChange={setFilterOpen}>
            <CollapsibleTrigger render={<Button variant="ghost" size="sm" className="gap-1" />}>
              <Filter className="size-4" /> Filtros
              <ChevronDown className={`size-4 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="absolute right-6 mt-2 z-10 bg-background border rounded-lg p-3 shadow-md space-y-2 w-48">
              <p className="text-xs font-semibold text-muted-foreground">PRIORIDAD</p>
              {(["Alta", "Media", "Baja"] as Priority[]).map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <Checkbox id={`p-${p}`} />
                  <label htmlFor={`p-${p}`} className="text-sm">{p}</label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Lista Tab */}
        <TabsContent value="lista" className="mt-4">
          <ScrollArea className="h-[400px]">
            {loading ? (
              <div className="space-y-2 pr-2">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
              </div>
            ) : (
              <div className="space-y-2 pr-2">
                {pending.map((task) => (
                  <HoverCard key={task.id}>
                    <HoverCardTrigger render={<div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-default transition-colors" />}>
                      <Checkbox checked={task.done} onCheckedChange={() => toggleTask(task.id)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.assignee}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={priorityColor[task.priority as Priority] ?? "secondary"} className="text-xs">{task.priority}</Badge>
                        <Badge variant="outline" className="text-xs gap-1">
                          <Tag className="size-3" />{task.category}
                        </Badge>
                        {task.due_date && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3" />{format(parseISO(task.due_date), "dd/MM")}
                          </span>
                        )}
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-72">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">{task.title}</h4>
                        <p className="text-xs text-muted-foreground">{task.description}</p>
                        <Separator />
                        <div className="flex justify-between text-xs">
                          <span>Asignado a: <strong>{task.assignee}</strong></span>
                          {task.due_date && <span>Vence: <strong>{format(parseISO(task.due_date), "dd MMM", { locale: es })}</strong></span>}
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
                {completed.length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <p className="text-xs text-muted-foreground px-1">Completadas ({completed.length})</p>
                    {completed.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border opacity-60">
                        <Checkbox checked={task.done} onCheckedChange={() => toggleTask(task.id)} />
                        <p className="text-sm line-through text-muted-foreground">{task.title}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Categoría Tab */}
        <TabsContent value="categoria" className="mt-4">
          <Accordion multiple className="space-y-2">
            {byCategory.map(({ category, tasks: catTasks }) => (
              <AccordionItem key={category} value={category} className="border rounded-lg px-3">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{category}</span>
                    <Badge variant="secondary">{catTasks.length}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pb-2">
                    {catTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                        <Checkbox checked={task.done} onCheckedChange={() => toggleTask(task.id)} />
                        <div className="flex-1">
                          <p className="text-sm">{task.title}</p>
                          <p className="text-xs text-muted-foreground">{task.assignee}</p>
                        </div>
                        <Badge variant={priorityColor[task.priority as Priority] ?? "secondary"} className="text-xs">{task.priority}</Badge>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        {/* Calendario Tab */}
        <TabsContent value="calendario" className="mt-4">
          <div className="flex gap-6 flex-wrap">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              locale={es}
            />
            <div className="flex-1 min-w-64">
              <h3 className="font-semibold text-sm mb-3">
                {date ? `Tareas para el ${format(date, "dd 'de' MMMM", { locale: es })}` : "Selecciona una fecha"}
              </h3>
              {date
                ? tasks
                    .filter((t) => t.due_date === format(date, "yyyy-MM-dd"))
                    .map((t) => (
                      <div key={t.id} className="flex items-center gap-2 p-2 rounded border mb-2">
                        <Checkbox checked={t.done} onCheckedChange={() => toggleTask(t.id)} />
                        <span className="text-sm">{t.title}</span>
                        <Badge variant={priorityColor[t.priority as Priority] ?? "secondary"} className="ml-auto text-xs">{t.priority}</Badge>
                      </div>
                    ))
                : <p className="text-muted-foreground text-sm">Haz clic en una fecha para ver las tareas programadas.</p>
              }
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
