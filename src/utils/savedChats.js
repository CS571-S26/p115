// src/utils/savedChats.js

const KEY = 'travelPlanner_savedChats'

export function getSavedChats() {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveChat({ name, type, result, formData }) {
  const chats = getSavedChats()
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: name.trim() || 'Untitled',
    type,        // 'flight' | 'accommodation' | 'activity'
    result,
    formData,
    savedAt: new Date().toISOString()
  }
  chats.unshift(entry)
  sessionStorage.setItem(KEY, JSON.stringify(chats))
  return entry
}

export function deleteChat(id) {
  const chats = getSavedChats().filter(c => c.id !== id)
  sessionStorage.setItem(KEY, JSON.stringify(chats))
}