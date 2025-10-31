"use client"

import { useState } from "react"
import { NewEntry } from "@/types/database.types"

interface EntryFormProps {
  initial?: Partial<NewEntry>
  onSave: (payload: NewEntry) => Promise<void>
  submitLabel?: string
}

export default function EntryForm({ initial, onSave, submitLabel = "Save Entry" }: EntryFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "")
  const [content, setContent] = useState(initial?.content ?? "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required")
      return
    }

    setLoading(true)

    try {
      await onSave({ title, content })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message || "Failed to save entry")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm mb-2 text-dark-brown font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field text-xl font-serif"
          placeholder="Give your entry a title..."
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm mb-2 text-dark-brown font-medium">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input-field min-h-[400px] resize-y leading-relaxed"
          placeholder="Write your thoughts..."
          required
          disabled={loading}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  )
}
