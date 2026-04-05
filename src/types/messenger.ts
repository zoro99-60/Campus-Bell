export type MessageType = 'text' | 'image' | 'voice'

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: MessageType
  media_url?: string
  duration?: number
  is_read: boolean
  created_at: string
}

export interface Conversation {
  id: string
  student_id: string
  teacher_id: string
  created_at: string
  updated_at: string
  last_message_at: string
  // Joined fields
  student?: {
    name: string
    profile_year?: number
    profile_division?: string
    profile_semester?: number
  }
  teacher?: {
    name: string
    subject?: string
    department?: string
  }
}
