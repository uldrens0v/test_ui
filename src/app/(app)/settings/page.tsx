"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Moon, Sun, Monitor } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type Settings = Database["public"]["Tables"]["settings"]["Row"];

// Estado local derivado de la fila de settings
interface LocalSettings {
  id: string;
  // Perfil
  name: string;
  email: string;
  bio: string;
  language: string;
  timezone: string;
  notif_digest: boolean;
  notif_mentions: boolean;
  notif_deploys: boolean;
  // Apariencia
  theme: string;
  density: string;
  font_size: number[];
  notification_channels: string[];
  // Seguridad
  two_factor: boolean;
  session_timeout: number;
  otp: string; // solo local, no persiste
  // Editor
  editor_bold: boolean;
  editor_italic: boolean;
  editor_underline: boolean;
  editor_align: string;
  editor_autosave: boolean;
  editor_spellcheck: boolean;
  editor_autocomplete: boolean;
  editor_line_numbers: boolean;
}

function rowToLocal(row: Settings): LocalSettings {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    bio: row.bio,
    language: row.language,
    timezone: row.timezone,
    notif_digest: row.notif_digest,
    notif_mentions: row.notif_mentions,
    notif_deploys: row.notif_deploys,
    theme: row.theme,
    density: row.density,
    font_size: [row.font_size],
    notification_channels: row.notification_channels,
    two_factor: row.two_factor,
    session_timeout: row.session_timeout,
    otp: "",
    editor_bold: row.editor_bold,
    editor_italic: row.editor_italic,
    editor_underline: row.editor_underline,
    editor_align: row.editor_align,
    editor_autosave: row.editor_autosave,
    editor_spellcheck: row.editor_spellcheck,
    editor_autocomplete: row.editor_autocomplete,
    editor_line_numbers: row.editor_line_numbers,
  };
}

const DEFAULT: LocalSettings = {
  id: "",
  name: "Admin",
  email: "admin@devboard.io",
  bio: "Desarrollador full-stack apasionado por el diseño de UI.",
  language: "es",
  timezone: "America/Mexico_City",
  notif_digest: true,
  notif_mentions: true,
  notif_deploys: false,
  theme: "system",
  density: "normal",
  font_size: [14],
  notification_channels: ["email", "push"],
  two_factor: false,
  session_timeout: 30,
  otp: "",
  editor_bold: false,
  editor_italic: false,
  editor_underline: false,
  editor_align: "left",
  editor_autosave: true,
  editor_spellcheck: true,
  editor_autocomplete: false,
  editor_line_numbers: false,
};

export default function SettingsPage() {
  const [s, setS] = useState<LocalSettings>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("settings")
      .select("*")
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (error) toast.error("Error cargando configuración");
        else if (data) setS(rowToLocal(data));
        setLoading(false);
      });
  }, []);

  const set = (patch: Partial<LocalSettings>) => setS((prev) => ({ ...prev, ...patch }));

  async function save(fields: Partial<Omit<Settings, "id">>, section: string) {
    if (!s.id) return;
    setSaving(true);
    const { error } = await supabase.from("settings").update(fields).eq("id", s.id);
    setSaving(false);
    if (error) toast.error(`Error al guardar ${section}`);
    else toast.success(`${section} guardado correctamente`);
  }

  const saveProfile = () =>
    save({ name: s.name, email: s.email, bio: s.bio, language: s.language, timezone: s.timezone }, "Perfil");

  const savePreferences = () =>
    save({ language: s.language, timezone: s.timezone, notif_digest: s.notif_digest, notif_mentions: s.notif_mentions, notif_deploys: s.notif_deploys }, "Preferencias");

  const saveAppearance = () =>
    save({ theme: s.theme, density: s.density, font_size: s.font_size[0], notification_channels: s.notification_channels }, "Apariencia");

  const saveSecurity = () =>
    save({ two_factor: s.two_factor, session_timeout: s.session_timeout }, "Seguridad");

  const saveEditor = () =>
    save({
      editor_bold: s.editor_bold,
      editor_italic: s.editor_italic,
      editor_underline: s.editor_underline,
      editor_align: s.editor_align,
      editor_autosave: s.editor_autosave,
      editor_spellcheck: s.editor_spellcheck,
      editor_autocomplete: s.editor_autocomplete,
      editor_line_numbers: s.editor_line_numbers,
    }, "Editor");

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Configuración</h1>
          <p className="text-muted-foreground text-sm">Administra tu cuenta y preferencias de DevBoard.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-muted-foreground text-sm">Administra tu cuenta y preferencias de DevBoard.</p>
      </div>

      <Tabs defaultValue="perfil" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
        </TabsList>

        {/* ── PERFIL ── */}
        <TabsContent value="perfil">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Información personal</CardTitle>
                <CardDescription>Actualiza tus datos de perfil.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" value={s.name} onChange={(e) => set({ name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={s.email} onChange={(e) => set({ email: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    value={s.bio}
                    onChange={(e) => set({ bio: e.target.value })}
                    rows={3}
                    placeholder="Cuéntanos sobre ti..."
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveProfile} disabled={saving}>Guardar cambios</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferencias regionales</CardTitle>
                <CardDescription>Idioma, zona horaria y notificaciones por email.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Idioma</Label>
                  <Select value={s.language} onValueChange={(v) => v && set({ language: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Zona horaria</Label>
                  <Select value={s.timezone} onValueChange={(v) => v && set({ timezone: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Mexico_City">Ciudad de México (UTC-6)</SelectItem>
                      <SelectItem value="America/Bogota">Bogotá (UTC-5)</SelectItem>
                      <SelectItem value="America/Buenos_Aires">Buenos Aires (UTC-3)</SelectItem>
                      <SelectItem value="Europe/Madrid">Madrid (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-sm">Notificaciones por email</Label>
                  {([
                    { key: "notif_digest" as const,   label: "Resumen diario" },
                    { key: "notif_mentions" as const, label: "Menciones directas" },
                    { key: "notif_deploys" as const,  label: "Estado de deploys" },
                  ]).map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2">
                      <Checkbox
                        id={key}
                        checked={s[key]}
                        onCheckedChange={(v) => set({ [key]: !!v })}
                      />
                      <label htmlFor={key} className="text-sm">{label}</label>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={savePreferences} disabled={saving}>Guardar</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* ── APARIENCIA ── */}
        <TabsContent value="apariencia">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tema</CardTitle>
                <CardDescription>Personaliza el aspecto visual de la app.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Modo de color</Label>
                  <RadioGroup value={s.theme} onValueChange={(v) => set({ theme: v })}>
                    {[
                      { value: "light",  label: "Claro",   icon: Sun },
                      { value: "dark",   label: "Oscuro",  icon: Moon },
                      { value: "system", label: "Sistema", icon: Monitor },
                    ].map(({ value, label, icon: Icon }) => (
                      <div key={value} className="flex items-center gap-3 p-3 rounded-lg border has-[:checked]:border-primary">
                        <RadioGroupItem value={value} id={`theme-${value}`} />
                        <label htmlFor={`theme-${value}`} className="flex items-center gap-2 cursor-pointer flex-1">
                          <Icon className="size-4" />
                          {label}
                          {s.theme === value && <Badge className="ml-auto text-xs">Activo</Badge>}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Densidad de contenido</Label>
                  <RadioGroup value={s.density} onValueChange={(v) => set({ density: v })} className="flex gap-3">
                    {["compact", "normal", "comfortable"].map((d) => (
                      <div key={d} className="flex items-center gap-2">
                        <RadioGroupItem value={d} id={`density-${d}`} />
                        <label htmlFor={`density-${d}`} className="text-sm capitalize cursor-pointer">{d}</label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveAppearance} disabled={saving}>Guardar</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipografía y accesibilidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Tamaño de fuente</Label>
                    <span className="text-sm text-muted-foreground">{s.font_size[0]}px</span>
                  </div>
                  <Slider
                    value={s.font_size}
                    onValueChange={(v) => {
                      const arr = Array.isArray(v) ? [...v] as number[] : [v as number];
                      set({ font_size: arr });
                    }}
                    min={12}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>12px</span><span>16px</span><span>20px</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Canales de notificación</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "email", label: "Email" },
                      { value: "push",  label: "Push" },
                      { value: "sms",   label: "SMS" },
                      { value: "slack", label: "Slack" },
                    ].map(({ value, label }) => (
                      <div key={value} className="flex items-center gap-2">
                        <Checkbox
                          id={`notif-${value}`}
                          checked={s.notification_channels.includes(value)}
                          onCheckedChange={(checked) => {
                            set({
                              notification_channels: checked
                                ? [...s.notification_channels, value]
                                : s.notification_channels.filter((n) => n !== value),
                            });
                          }}
                        />
                        <label htmlFor={`notif-${value}`} className="text-sm">{label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveAppearance} disabled={saving}>Guardar</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* ── SEGURIDAD ── */}
        <TabsContent value="seguridad">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contraseña</CardTitle>
                <CardDescription>Cambia tu contraseña regularmente.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Contraseña actual</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="grid gap-2">
                  <Label>Nueva contraseña</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="grid gap-2">
                  <Label>Confirmar contraseña</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast.success("Contraseña actualizada")}>Actualizar contraseña</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Autenticación 2FA</CardTitle>
                <CardDescription>Agrega una capa extra de seguridad a tu cuenta.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Autenticación de dos factores</Label>
                    <p className="text-xs text-muted-foreground">Requiere código al iniciar sesión</p>
                  </div>
                  <Switch
                    checked={s.two_factor}
                    onCheckedChange={async (v) => {
                      set({ two_factor: v });
                      await save({ two_factor: v }, "2FA");
                    }}
                  />
                </div>

                {s.two_factor && (
                  <div className="space-y-3">
                    <Label>Ingresa el código de verificación</Label>
                    <InputOTP
                      maxLength={6}
                      value={s.otp}
                      onChange={(v) => set({ otp: v })}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <Button size="sm" onClick={() => {
                      if (s.otp.length === 6) toast.success("2FA configurado correctamente");
                      else toast.error("Código incompleto");
                    }}>
                      Verificar
                    </Button>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Tiempo de inactividad (min)</Label>
                    <span className="text-sm text-muted-foreground">{s.session_timeout} min</span>
                  </div>
                  <Slider
                    value={[s.session_timeout]}
                    onValueChange={(v) => {
                      const val = Array.isArray(v) ? v[0] : (v as number);
                      set({ session_timeout: val });
                    }}
                    min={5}
                    max={120}
                    step={5}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSecurity} disabled={saving}>Guardar seguridad</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* ── EDITOR ── */}
        <TabsContent value="editor">
          <Card>
            <CardHeader>
              <CardTitle>Editor de texto</CardTitle>
              <CardDescription>Personaliza el comportamiento del editor integrado.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Barra de herramientas</Label>
                <div className="flex flex-wrap gap-2">
                  <Toggle pressed={s.editor_bold} onPressedChange={(v) => set({ editor_bold: v })} aria-label="Bold">
                    <Bold className="size-4" />
                  </Toggle>
                  <Toggle pressed={s.editor_italic} onPressedChange={(v) => set({ editor_italic: v })} aria-label="Italic">
                    <Italic className="size-4" />
                  </Toggle>
                  <Toggle pressed={s.editor_underline} onPressedChange={(v) => set({ editor_underline: v })} aria-label="Underline">
                    <Underline className="size-4" />
                  </Toggle>

                  <Separator orientation="vertical" className="h-9 mx-1" />

                  <ToggleGroup
                    value={[s.editor_align]}
                    onValueChange={(v) => {
                      if (v.length > 0) set({ editor_align: v[v.length - 1] });
                    }}
                  >
                    <ToggleGroupItem value="left"   aria-label="Alinear izquierda"><AlignLeft className="size-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="center" aria-label="Centrar"><AlignCenter className="size-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="right"  aria-label="Alinear derecha"><AlignRight className="size-4" /></ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>

              <div
                className="p-4 rounded-lg border min-h-24 text-sm text-muted-foreground"
                style={{
                  fontWeight: s.editor_bold ? "bold" : "normal",
                  fontStyle: s.editor_italic ? "italic" : "normal",
                  textDecoration: s.editor_underline ? "underline" : "none",
                  textAlign: s.editor_align as "left" | "center" | "right",
                }}
              >
                Este es un texto de ejemplo que muestra los estilos del editor en tiempo real. Usa los controles de arriba para cambiar el formato.
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Opciones del editor</Label>
                <div className="space-y-2">
                  {([
                    { key: "editor_autosave" as const,      label: "Guardar automáticamente" },
                    { key: "editor_spellcheck" as const,    label: "Corrector ortográfico" },
                    { key: "editor_autocomplete" as const,  label: "Autocompletado de código" },
                    { key: "editor_line_numbers" as const,  label: "Números de línea" },
                  ]).map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <label htmlFor={key} className="text-sm">{label}</label>
                      <Switch
                        id={key}
                        checked={s[key]}
                        onCheckedChange={(v) => set({ [key]: v })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveEditor} disabled={saving}>Guardar preferencias</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
