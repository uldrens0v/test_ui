export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      members: {
        Row: {
          email: string
          id: string
          joined_at: string
          name: string
          role: string
          status: string
          tasks_count: number
        }
        Insert: {
          email: string
          id?: string
          joined_at?: string
          name: string
          role?: string
          status?: string
          tasks_count?: number
        }
        Update: {
          email?: string
          id?: string
          joined_at?: string
          name?: string
          role?: string
          status?: string
          tasks_count?: number
        }
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          read: boolean
          title: string
          type: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read?: boolean
          title: string
          type?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          type?: string
        }
      }
      settings: {
        Row: {
          bio: string
          density: string
          editor_align: string
          editor_autocomplete: boolean
          editor_autosave: boolean
          editor_bold: boolean
          editor_italic: boolean
          editor_line_numbers: boolean
          editor_spellcheck: boolean
          editor_underline: boolean
          email: string
          font_size: number
          id: string
          language: string
          name: string
          notif_deploys: boolean
          notif_digest: boolean
          notif_mentions: boolean
          notification_channels: string[]
          session_timeout: number
          theme: string
          timezone: string
          two_factor: boolean
        }
        Insert: {
          bio?: string
          density?: string
          editor_align?: string
          editor_autocomplete?: boolean
          editor_autosave?: boolean
          editor_bold?: boolean
          editor_italic?: boolean
          editor_line_numbers?: boolean
          editor_spellcheck?: boolean
          editor_underline?: boolean
          email?: string
          font_size?: number
          id?: string
          language?: string
          name?: string
          notif_deploys?: boolean
          notif_digest?: boolean
          notif_mentions?: boolean
          notification_channels?: string[]
          session_timeout?: number
          theme?: string
          timezone?: string
          two_factor?: boolean
        }
        Update: {
          bio?: string
          density?: string
          editor_align?: string
          editor_autocomplete?: boolean
          editor_autosave?: boolean
          editor_bold?: boolean
          editor_italic?: boolean
          editor_line_numbers?: boolean
          editor_spellcheck?: boolean
          editor_underline?: boolean
          email?: string
          font_size?: number
          id?: string
          language?: string
          name?: string
          notif_deploys?: boolean
          notif_digest?: boolean
          notif_mentions?: boolean
          notification_channels?: string[]
          session_timeout?: number
          theme?: string
          timezone?: string
          two_factor?: boolean
        }
      }
      tasks: {
        Row: {
          assignee: string
          category: string
          description: string
          done: boolean
          due_date: string | null
          id: string
          member_id: string | null
          priority: string
          title: string
        }
        Insert: {
          assignee?: string
          category?: string
          description?: string
          done?: boolean
          due_date?: string | null
          id?: string
          member_id?: string | null
          priority?: string
          title: string
        }
        Update: {
          assignee?: string
          category?: string
          description?: string
          done?: boolean
          due_date?: string | null
          id?: string
          member_id?: string | null
          priority?: string
          title?: string
        }
      }
    }
  }
}
