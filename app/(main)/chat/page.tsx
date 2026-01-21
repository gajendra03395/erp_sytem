'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Send, Paperclip, Search, Plus, Pin, Lock, Reply, Download, Image as ImageIcon, Video, FileText, Trash2, Edit, MoreVertical } from 'lucide-react'

interface ChatThread {
  id: string
  title: string
  description?: string
  category: string
  isPinned: boolean
  isLocked: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  creator: {
    id: string
    email: string
    employee?: {
      name: string
      employeeId: string
    }
  }
  _count: {
    messages: number
    attachments: number
  }
}

interface Message {
  id: string
  content: string
  threadId: string
  senderId: string
  isEdited: boolean
  createdAt: string
  updatedAt: string
  sender: {
    id: string
    email: string
    employee?: {
      name: string
      employeeId: string
    }
  }
  attachments: any[]
  _count: {
    replies: number
  }
}

export default function ChatPage() {
  const { userName, userEmail } = useAuth()
  const { theme } = useTheme()
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [showNewThreadModal, setShowNewThreadModal] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState('')
  const [newThreadDescription, setNewThreadDescription] = useState('')
  const [newThreadCategory, setNewThreadCategory] = useState('general')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [messageLoading, setMessageLoading] = useState(false)

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'production', label: 'Production' },
    { value: 'hr', label: 'HR' },
    { value: 'it', label: 'IT' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'quality', label: 'Quality' }
  ]

  useEffect(() => {
    fetchThreads()
  }, [])

  useEffect(() => {
    if (selectedThread) {
      fetchMessages(selectedThread.id)
    }
  }, [selectedThread])

  const fetchThreads = async () => {
    try {
      setLoading(true)
      // Using localStorage for persistence instead of API
      const storedThreads = localStorage.getItem('chat_threads')
      if (storedThreads) {
        setThreads(JSON.parse(storedThreads))
      } else {
        // Default threads
        const defaultThreads = [
          {
            id: '1',
            title: 'General Discussion',
            description: 'Company-wide announcements and discussions',
            category: 'general',
            isPinned: true,
            isLocked: false,
            createdBy: 'user1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            creator: {
              id: 'user1',
              email: 'admin@company.com',
              employee: {
                name: 'Admin User',
                employeeId: 'ADMIN001'
              }
            },
            _count: {
              messages: 15,
              attachments: 3
            }
          },
          {
            id: '2',
            title: 'Production Updates',
            description: 'Daily production status and updates',
            category: 'production',
            isPinned: false,
            isLocked: false,
            createdBy: 'user2',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            creator: {
              id: 'user2',
              email: 'manager@company.com',
              employee: {
                name: 'Production Manager',
                employeeId: 'PROD001'
              }
            },
            _count: {
              messages: 8,
              attachments: 2
            }
          }
        ]
        setThreads(defaultThreads)
        localStorage.setItem('chat_threads', JSON.stringify(defaultThreads))
      }
    } catch (error) {
      console.error('Error fetching threads:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (threadId: string) => {
    try {
      setMessageLoading(true)
      // Using localStorage for persistence
      const storedMessages = localStorage.getItem(`chat_messages_${threadId}`)
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages))
      } else {
        // Default messages
        const defaultMessages = [
          {
            id: '1',
            content: 'Welcome to the company chat system! This is a great platform for team communication.',
            threadId: threadId,
            senderId: 'user1',
            isEdited: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            sender: {
              id: 'user1',
              email: 'admin@company.com',
              employee: {
                name: 'Admin User',
                employeeId: 'ADMIN001'
              }
            },
            attachments: [
              {
                id: 'att1',
                filename: 'sample-image.jpg',
                originalName: 'company-logo.jpg',
                mimeType: 'image/jpeg',
                fileSize: 245760,
                filePath: '/uploads/chat/sample-image.jpg'
              }
            ],
            _count: {
              replies: 0
            }
          },
          {
            id: '2',
            content: 'Thanks! This looks amazing! 🎉 Check out this photo I uploaded.',
            threadId: threadId,
            senderId: 'current-user',
            isEdited: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            sender: {
              id: 'current-user',
              email: userEmail || 'user@company.com',
              employee: {
                name: userName || 'Current User',
                employeeId: 'EMP001'
              }
            },
            attachments: [
              {
                id: 'att2',
                filename: 'profile-pic.png',
                originalName: 'my-profile.png',
                mimeType: 'image/png',
                fileSize: 512000,
                filePath: '/uploads/chat/profile-pic.png'
              }
            ],
            _count: {
              replies: 0
            }
          }
        ]
        setMessages(defaultMessages)
        localStorage.setItem(`chat_messages_${threadId}`, JSON.stringify(defaultMessages))
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setMessageLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return
    if (!selectedThread) return

    try {
      const newMsg = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        threadId: selectedThread.id,
        senderId: 'current-user',
        isEdited: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sender: {
          id: 'current-user',
          email: userEmail || 'user@company.com',
          employee: {
            name: userName || 'Current User',
            employeeId: 'EMP001'
          }
        },
        attachments: [],
        _count: {
          replies: 0
        }
      }

      const updatedMessages = [...messages, newMsg]
      setMessages(updatedMessages)
      localStorage.setItem(`chat_messages_${selectedThread.id}`, JSON.stringify(updatedMessages))
      setNewMessage('')
      setSelectedFiles([])
      setReplyingTo(null)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      const updatedMessages = messages.filter(msg => msg.id !== messageId)
      setMessages(updatedMessages)
      localStorage.setItem(`chat_messages_${selectedThread?.id}`, JSON.stringify(updatedMessages))
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const deleteThread = async (threadId: string) => {
    try {
      const updatedThreads = threads.filter(thread => thread.id !== threadId)
      setThreads(updatedThreads)
      localStorage.setItem('chat_threads', JSON.stringify(updatedThreads))
      
      // Also delete messages for this thread
      localStorage.removeItem(`chat_messages_${threadId}`)
      
      if (selectedThread?.id === threadId) {
        setSelectedThread(null)
      }
    } catch (error) {
      console.error('Error deleting thread:', error)
    }
  }

  const createThread = async () => {
    if (!newThreadTitle.trim()) return

    try {
      const newThread = {
        id: Date.now().toString(),
        title: newThreadTitle.trim(),
        description: newThreadDescription.trim(),
        category: newThreadCategory,
        isPinned: false,
        isLocked: false,
        createdBy: 'current-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creator: {
          id: 'current-user',
          email: userEmail || 'user@company.com',
          employee: {
            name: userName || 'Current User',
            employeeId: 'EMP001'
          }
        },
        _count: {
          messages: 0,
          attachments: 0
        }
      }

      const updatedThreads = [newThread, ...threads]
      setThreads(updatedThreads)
      localStorage.setItem('chat_threads', JSON.stringify(updatedThreads))
      
      setShowNewThreadModal(false)
      setNewThreadTitle('')
      setNewThreadDescription('')
      setNewThreadCategory('general')
      setSelectedThread(newThread)
    } catch (error) {
      console.error('Error creating thread:', error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <ImageIcon size={16} />
    }
    if (mimeType.startsWith('video/')) {
      return <Video size={16} />
    }
    return <FileText size={16} />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-80 border-r ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex flex-col`}>
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Company Chat
            </h1>
            <button
              onClick={() => setShowNewThreadModal(true)}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="relative">
            <Search size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search threads..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <select
            className={`w-full mt-3 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {threads.map(thread => (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedThread?.id === thread.id
                      ? theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
                      : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  } ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {thread.isPinned && <Pin size={14} className="text-yellow-500" />}
                        {thread.isLocked && <Lock size={14} className="text-red-500" />}
                        <h3 className="font-medium truncate">{thread.title}</h3>
                      </div>
                      <p className={`text-sm mt-1 truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {thread.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                          {thread.creator.employee?.name || thread.creator.email}
                        </span>
                        <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                          {formatDate(thread.updatedAt)}
                        </span>
                        <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                          {thread._count.messages} messages
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteThread(thread.id)
                      }}
                      className={`p-1 rounded hover:bg-opacity-80 ${theme === 'dark' ? 'hover:bg-red-600 text-red-400' : 'hover:bg-red-100 text-red-600'}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedThread ? (
          <>
            <div className={`p-4 border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {selectedThread.title}
                  </h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedThread.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedThread.isPinned && <Pin size={16} className="text-yellow-500" />}
                  {selectedThread.isLocked && <Lock size={16} className="text-red-500" />}
                  <span className={`px-2 py-1 text-xs rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    {selectedThread.category}
                  </span>
                </div>
              </div>
            </div>

            <div className={`flex-1 overflow-y-auto p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
              {messageLoading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.filter(msg => msg.threadId === selectedThread.id).map(message => (
                    <div key={message.id} className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-2xl ${message.senderId === 'current-user' ? 'order-2' : 'order-1'}`}>
                        <div className={`flex items-center gap-2 mb-1 ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}>
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {message.sender.employee?.name || message.sender.email}
                          </span>
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            {formatTime(message.createdAt)}
                          </span>
                          {message.isEdited && <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>(edited)</span>}
                        </div>
                        <div className={`rounded-lg p-3 ${
                          message.senderId === 'current-user'
                            ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                            : theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 border border-gray-200'
                        }`}>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map(attachment => (
                              <div key={attachment.id} className={`flex items-center gap-2 p-2 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}`}>
                                {getFileIcon(attachment.mimeType)}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm truncate">{attachment.originalName}</p>
                                  <p className="text-xs opacity-75">{formatFileSize(attachment.fileSize)}</p>
                                </div>
                                <a
                                  href={attachment.filePath}
                                  download={attachment.originalName}
                                  className={`p-1 rounded hover:bg-opacity-80 ${message.senderId === 'current-user' ? 'hover:bg-blue-700' : 'hover:bg-gray-200'}`}
                                >
                                  <Download size={16} />
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <button className={`p-1 rounded hover:bg-opacity-80 ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}>
                            <Reply size={14} />
                          </button>
                          {message.senderId === 'current-user' && (
                            <>
                              <button className={`p-1 rounded hover:bg-opacity-80 ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}>
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => deleteMessage(message.id)}
                                className={`p-1 rounded hover:bg-opacity-80 ${theme === 'dark' ? 'hover:bg-red-600 text-red-400' : 'hover:bg-red-100 text-red-600'}`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={`p-4 border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              {selectedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      {getFileIcon(file.type)}
                      <span className="text-sm truncate max-w-32">{file.name}</span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatFileSize(file.size)}
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        className={`p-1 rounded hover:bg-opacity-80 ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar,.7z"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  <Paperclip size={20} />
                </button>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Type your message..."
                  className={`flex-1 px-4 py-2 rounded-lg resize-none ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  rows={1}
                />
                <button
                  onClick={sendMessage}
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Select a thread to start chatting
              </h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Choose a thread from the sidebar or create a new one
              </p>
            </div>
          </div>
        )}
      </div>

      {showNewThreadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-md p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Create New Thread
            </h2>
            <input
              type="text"
              placeholder="Thread Title"
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg mb-3 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <textarea
              placeholder="Description (optional)"
              value={newThreadDescription}
              onChange={(e) => setNewThreadDescription(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg mb-3 resize-none ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              rows={3}
            />
            <select
              value={newThreadCategory}
              onChange={(e) => setNewThreadCategory(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="general">General</option>
              <option value="production">Production</option>
              <option value="hr">HR</option>
              <option value="it">IT</option>
              <option value="maintenance">Maintenance</option>
              <option value="quality">Quality</option>
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewThreadModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
              >
                Cancel
              </button>
              <button
                onClick={createThread}
                className={`flex-1 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
              >
                Create Thread
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
