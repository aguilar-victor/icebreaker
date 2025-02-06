export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string
          host_id: string | null
          guest_id: string | null
          status: 'waiting' | 'answering' | 'discussing' | 'completed'
          created_at: string
          current_question_index: number
          is_guest_session: boolean
          password: string
        }
        Insert: {
          id?: string
          host_id?: string | null
          guest_id?: string | null
          status?: 'waiting' | 'answering' | 'discussing' | 'completed'
          created_at?: string
          current_question_index?: number
          is_guest_session?: boolean
          password: string
        }
        Update: {
          id?: string
          host_id?: string | null
          guest_id?: string | null
          status?: 'waiting' | 'answering' | 'discussing' | 'completed'
          created_at?: string
          current_question_index?: number
          is_guest_session?: boolean
          password?: string
        }
      }
      answers: {
        Row: {
          id: string
          room_id: string
          user_id: string
          question_id: number
          answer: boolean
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          question_id: number
          answer: boolean
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          question_id?: number
          answer?: boolean
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: number
          text: string
          category: 'personal' | 'professional' | 'fun'
          created_at: string
        }
        Insert: {
          id?: number
          text: string
          category: 'personal' | 'professional' | 'fun'
          created_at?: string
        }
        Update: {
          id?: number
          text?: string
          category?: 'personal' | 'professional' | 'fun'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      verify_room_password: {
        Args: {
          room_id: string
          attempted_password: string
        }
        Returns: boolean
      }
    }
    Enums: {
      room_status: 'waiting' | 'answering' | 'discussing' | 'completed'
      question_category: 'personal' | 'professional' | 'fun'
    }
  }
}