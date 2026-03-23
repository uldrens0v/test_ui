"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Moon, Sun, Monitor } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "shadcn",
    email: "admin@devboard.io",
    bio: "Desarrollador full-stack apasionado por el diseño de UI.",
    language: "es",
    timezone: "America/Mexico_City",
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: 30,
    otp: "",
  });

  const [appearance, setAppearance] = useState({
    theme: "system",
    density: "normal",
    fontSize: [14],
    notifications: ["email", "push"],
  });

  const [editor, setEditor] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: "left",
  });

  const save = (section: string) => toast.success(`${section} guardado correctamente`);

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

        {/* Perfil */}
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
                  <Input id="name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                    rows={3}
                    placeholder="Cuéntanos sobre ti..."
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => save("Perfil")}>Guardar cambios</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferencias regionales</CardTitle>
                <CardDescription>Idioma, zona horaria y formato de fecha.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Idioma</Label>
                  <Select value={profile.language} onValueChange={(v) => v && setProfile((p) => ({ ...p, language: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                  <Select value={profile.timezone} onValueChange={(v) => v && setProfile((p) => ({ ...p, timezone: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                  {[
                    { id: "digest", label: "Resumen diario" },
                    { id: "mentions", label: "Menciones directas" },
                    { id: "deploys", label: "Estado de deploys" },
                  ].map(({ id, label }) => (
                    <div key={id} className="flex items-center gap-2">
                      <Checkbox id={id} defaultChecked={id !== "deploys"} />
                      <label htmlFor={id} className="text-sm">{label}</label>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => save("Preferencias")}>Guardar</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Apariencia */}
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
                  <RadioGroup value={appearance.theme} onValueChange={(v) => setAppearance((p) => ({ ...p, theme: v }))}>
                    {[
                      { value: "light", label: "Claro", icon: Sun },
                      { value: "dark", label: "Oscuro", icon: Moon },
                      { value: "system", label: "Sistema", icon: Monitor },
                    ].map(({ value, label, icon: Icon }) => (
                      <div key={value} className="flex items-center gap-3 p-3 rounded-lg border has-[:checked]:border-primary">
                        <RadioGroupItem value={value} id={`theme-${value}`} />
                        <label htmlFor={`theme-${value}`} className="flex items-center gap-2 cursor-pointer flex-1">
                          <Icon className="size-4" />
                          {label}
                          {appearance.theme === value && <Badge className="ml-auto text-xs">Activo</Badge>}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Densidad de contenido</Label>
                  <RadioGroup value={appearance.density} onValueChange={(v) => setAppearance((p) => ({ ...p, density: v }))} className="flex gap-3">
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
                <Button onClick={() => save("Apariencia")}>Guardar</Button>
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
                    <span className="text-sm text-muted-foreground">{appearance.fontSize[0]}px</span>
                  </div>
                  <Slider
                    value={appearance.fontSize}
                    onValueChange={(v) => {
                      const arr = Array.isArray(v) ? [...v] as number[] : [v as number];
                      setAppearance((p) => ({ ...p, fontSize: arr }));
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
                      { value: "push", label: "Push" },
                      { value: "sms", label: "SMS" },
                      { value: "slack", label: "Slack" },
                    ].map(({ value, label }) => (
                      <div key={value} className="flex items-center gap-2">
                        <Checkbox
                          id={`notif-${value}`}
                          checked={appearance.notifications.includes(value)}
                          onCheckedChange={(checked) => {
                            setAppearance((p) => ({
                              ...p,
                              notifications: checked
                                ? [...p.notifications, value]
                                : p.notifications.filter((n) => n !== value),
                            }));
                          }}
                        />
                        <label htmlFor={`notif-${value}`} className="text-sm">{label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Seguridad */}
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
                <Button onClick={() => save("Contraseña")}>Actualizar contraseña</Button>
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
                    checked={security.twoFactor}
                    onCheckedChange={(v) => {
                      setSecurity((p) => ({ ...p, twoFactor: v }));
                      toast(v ? "2FA activado" : "2FA desactivado");
                    }}
                  />
                </div>

                {security.twoFactor && (
                  <div className="space-y-3">
                    <Label>Ingresa el código de verificación</Label>
                    <InputOTP
                      maxLength={6}
                      value={security.otp}
                      onChange={(v) => setSecurity((p) => ({ ...p, otp: v }))}
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
                      if (security.otp.length === 6) {
                        toast.success("2FA configurado correctamente");
                      } else {
                        toast.error("Código incompleto");
                      }
                    }}>
                      Verificar
                    </Button>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Tiempo de inactividad (min)</Label>
                    <span className="text-sm text-muted-foreground">{security.sessionTimeout} min</span>
                  </div>
                  <Slider
                    value={[security.sessionTimeout]}
                    onValueChange={(v) => {
                      const val = Array.isArray(v) ? v[0] : (v as number);
                      setSecurity((p) => ({ ...p, sessionTimeout: val }));
                    }}
                    min={5}
                    max={120}
                    step={5}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Editor */}
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
                  <Toggle
                    pressed={editor.bold}
                    onPressedChange={(v) => setEditor((p) => ({ ...p, bold: v }))}
                    aria-label="Bold"
                  >
                    <Bold className="size-4" />
                  </Toggle>
                  <Toggle
                    pressed={editor.italic}
                    onPressedChange={(v) => setEditor((p) => ({ ...p, italic: v }))}
                    aria-label="Italic"
                  >
                    <Italic className="size-4" />
                  </Toggle>
                  <Toggle
                    pressed={editor.underline}
                    onPressedChange={(v) => setEditor((p) => ({ ...p, underline: v }))}
                    aria-label="Underline"
                  >
                    <Underline className="size-4" />
                  </Toggle>

                  <Separator orientation="vertical" className="h-9 mx-1" />

                  <ToggleGroup
                    value={[editor.align]}
                    onValueChange={(v) => {
                      if (v.length > 0) setEditor((p) => ({ ...p, align: v[v.length - 1] }));
                    }}
                  >
                    <ToggleGroupItem value="left" aria-label="Alinear izquierda">
                      <AlignLeft className="size-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="center" aria-label="Centrar">
                      <AlignCenter className="size-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="right" aria-label="Alinear derecha">
                      <AlignRight className="size-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>

              <div className="p-4 rounded-lg border min-h-24 text-sm text-muted-foreground"
                style={{
                  fontWeight: editor.bold ? "bold" : "normal",
                  fontStyle: editor.italic ? "italic" : "normal",
                  textDecoration: editor.underline ? "underline" : "none",
                  textAlign: editor.align as "left" | "center" | "right",
                }}
              >
                Este es un texto de ejemplo que muestra los estilos del editor en tiempo real. Usa los controles de arriba para cambiar el formato.
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Opciones de autoguardado</Label>
                <div className="space-y-2">
                  {[
                    { id: "autosave", label: "Guardar automáticamente" },
                    { id: "spellcheck", label: "Corrector ortográfico" },
                    { id: "autocomplete", label: "Autocompletado de código" },
                    { id: "lineNumbers", label: "Números de línea" },
                  ].map(({ id, label }) => (
                    <div key={id} className="flex items-center justify-between">
                      <label htmlFor={id} className="text-sm">{label}</label>
                      <Switch id={id} defaultChecked={id === "autosave" || id === "spellcheck"} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => save("Editor")}>Guardar preferencias</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
