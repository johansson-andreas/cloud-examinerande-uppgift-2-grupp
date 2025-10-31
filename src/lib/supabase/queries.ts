import { supabase } from './client'
import { Entry, NewEntry } from '@/types/database.types'

/**
 * Fetch all entries for the authenticated user
 */
export async function getEntries(): Promise<Entry[]> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data || []
}

/**
 * Create a new entry for the authenticated user
 */
export async function createEntry(entry: NewEntry): Promise<Entry> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('entries')
    .insert([
      {
        user_id: user.id,
        title: `Title är: ${entry.title}`,
        content: entry.content,
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * Fetch a single entry by id for the authenticated user
 */
export async function getEntry(id: string): Promise<Entry> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .match({ id, user_id: user.id })
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * Update an entry
 */
export async function updateEntry(id: string, updates: Partial<NewEntry>): Promise<Entry> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  if (!updates || Object.keys(updates).length === 0) {
    throw new Error('No updates provided')
  }

  const { data, error } = await supabase
    .from('entries')
    .update(updates)
    .match({ id, user_id: user.id })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}
