'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Message, Conversation } from '@/types/messenger'
import { format } from 'date-fns'
import { Send, Image as ImageIcon, Mic, X, Play, Pause, ChevronLeft, MoreVertical } from 'lucide-react'
import Link from 'next/link'

interface ChatBoardProps {
  conversationId: string
  currentUserId: string
  currentUserRole: 'student' | 'teacher'
  otherUser: {
    name: string
    subtext?: string
    avatarInitials: string
  }
}

export function ChatBoard({ conversationId, currentUserId, currentUserRole, otherUser }: ChatBoardProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // 1. Fetch initial messages & setup Realtime
  useEffect(() => {
    async function fetchMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      
      if (data) setMessages(data as Message[])
    }

    fetchMessages()

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}` 
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  // 2. Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // 3. Handlers
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputText.trim() || isUploading) return

    const text = inputText.trim()
    setInputText('')

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: text,
      message_type: 'text'
    })

    if (error) {
       console.error('Failed to send:', error)
       setInputText(text) // Restore on error
    }
  }

  const handleFileUpload = async (file: File, type: 'image' | 'voice') => {
    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${conversationId}/${fileName}`

      const { data, error } = await supabase.storage
        .from('chat-media')
        .upload(filePath, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('chat-media')
        .getPublicUrl(filePath)

      await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        content: type === 'image' ? 'Sent an image' : 'Voice message',
        message_type: type,
        media_url: publicUrl
      })
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setIsUploading(false)
    }
  }

  // 4. Renderers
  const renderMessage = (msg: Message) => {
    const isMe = msg.sender_id === currentUserId
    const time = format(new Date(msg.created_at), 'HH:mm')

    return (
      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3 px-4 animate-in fade-in slide-in-from-bottom-1 duration-300`}>
        <div className={`max-w-[75%] rounded-2xl px-3 py-2 shadow-sm relative ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
          
          {msg.message_type === 'image' && msg.media_url && (
            <div className="mb-2 rounded-lg overflow-hidden border border-black/5">
              <img src={msg.media_url} alt="Shared" className="max-h-60 w-full object-cover" />
            </div>
          )}

          {msg.message_type === 'voice' && msg.media_url && (
            <div className="flex items-center gap-3 py-1 min-w-[160px]">
               <button className={`h-8 w-8 rounded-full flex items-center justify-center ${isMe ? 'bg-blue-500' : 'bg-slate-100 text-slate-600'}`}>
                 <Play className="h-4 w-4 fill-current" />
               </button>
               <div className="flex-1 h-1 bg-black/10 rounded-full relative">
                  <div className={`absolute left-0 top-0 h-full w-1/3 rounded-full ${isMe ? 'bg-white' : 'bg-blue-500'}`}></div>
               </div>
               <span className="text-[10px] font-bold opacity-70">0:04</span>
            </div>
          )}

          {msg.message_type === 'text' && (
            <p className="text-[14px] leading-relaxed break-words">{msg.content}</p>
          )}

          <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
            <span className="text-[9px] font-bold">{time}</span>
            {isMe && (
               <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/></svg>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5] dark:bg-slate-950 font-sans">
      {/* WhatsApp Style Header */}
      <div className="bg-[#f0f2f5] dark:bg-slate-900 px-4 py-3 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <Link href={currentUserRole === 'student' ? '/student/messenger' : '/teacher/messenger'} className="h-8 w-8 flex items-center justify-center text-slate-500 hover:bg-slate-200 rounded-full transition-all">
           <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="h-10 w-10 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-200 shadow-sm border border-white">
          {otherUser.avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate leading-none">{otherUser.name}</h2>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">{otherUser.subtext || 'Active now'}</p>
        </div>
        <button className="h-8 w-8 flex items-center justify-center text-slate-500 hover:bg-slate-200 rounded-full"><MoreVertical className="h-5 w-5" /></button>
      </div>

      {/* Chat History Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-4 bg-[url('https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-dark-background-whatsapp-solid-color.jpg')] bg-fixed bg-cover"
      >
        {messages.map(renderMessage)}
      </div>

      {/* WhatsApp Style Input Bar */}
      <div className="bg-[#f0f2f5] dark:bg-slate-900 px-3 py-3 flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 shadow-lg">
        <label className="h-10 w-10 flex items-center justify-center text-slate-500 hover:bg-slate-200 rounded-full transition-all cursor-pointer">
           <ImageIcon className="h-5 w-5" />
           <input type="file" className="hidden" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file, 'image')
           }} />
        </label>
        
        <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-800 rounded-2xl px-4 py-1.5 shadow-sm border border-slate-200 dark:border-slate-700">
          <input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message" 
            className="flex-1 bg-transparent border-none outline-none text-[14px] text-slate-800 dark:text-white/90 placeholder-slate-400 min-h-[36px]"
          />
          {inputText.trim() ? (
            <button type="submit" className="text-blue-600 dark:text-blue-400 hover:scale-110 active:scale-95 transition-all">
              <Send className="h-5 w-5 fill-current" />
            </button>
          ) : (
            <button 
              type="button" 
              className={`transition-all ${isRecording ? 'text-red-600 scale-125 animate-pulse' : 'text-slate-500 hover:text-blue-600'}`}
              onMouseDown={() => setIsRecording(true)}
              onMouseUp={() => setIsRecording(false)}
              onMouseLeave={() => setIsRecording(false)}
              onTouchStart={() => setIsRecording(true)}
              onTouchEnd={() => setIsRecording(false)}
            >
              <Mic className="h-5 w-5" />
            </button>
          )}
        </form>
      </div>

      {/* Recording Overlay */}
      {isRecording && (
        <div className="absolute inset-x-0 bottom-[68px] bg-red-50/95 dark:bg-red-950/90 backdrop-blur-sm border-t border-red-100 dark:border-red-900/50 px-6 py-4 flex items-center justify-between z-40 animate-in slide-in-from-bottom-full duration-300">
           <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-600 animate-ping"></div>
              <span className="text-xs font-bold text-red-700 dark:text-red-400 tracking-tight">RECORDING VOICE...</span>
           </div>
           <span className="text-sm font-mono font-bold text-red-600">0:04</span>
        </div>
      )}
    </div>
  )
}
