// Import the functions we want to test
import { updateEntry, getEntry } from './queries'

// Mock the entire supabase client module so we can control what it returns
// and verify it was called correctly. This prevents actual network calls.
jest.mock('./client', () => {
  return {
    supabase: {
      auth: {
        // Mock getUser to simulate authenticated user
        getUser: jest.fn(),
      },
      from: jest.fn(() => ({
        // Chain methods that Supabase uses for queries
        update: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        match: jest.fn().mockReturnThis(),
        single: jest.fn(),
      })),
    },
  }
})

// Import the mocked supabase instance to configure it in tests
import { supabase } from './client'

describe('updateEntry', () => {
  const mockUserId = 'user-123'
  const entryId = 'entry-456'

  beforeEach(() => {
    // Clear all mock call counts and implementations between tests
    // to ensure tests don't interfere with each other
    jest.clearAllMocks()

    // Default: mock a successful authentication for all tests
    // Individual tests can override this if they need to test auth failures
    ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: mockUserId } },
      error: null,
    })
  })

  describe('success cases', () => {
    it('updates an entry with partial data and returns the updated entry', async () => {
      // Arrange: set up the mock to return a successful update
      const updates = { title: 'Updated Title' }
      const mockUpdatedEntry = {
        id: entryId,
        user_id: mockUserId,
        title: 'Updated Title',
        content: 'Original content',
        created_at: '2025-10-31T10:00:00Z',
      }

      // Mock the Supabase query chain to resolve with the updated data
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockUpdatedEntry,
        error: null,
      })

      const mockMatch = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: mockSingle,
        }),
      })

      const mockUpdate = jest.fn().mockReturnValue({
        match: mockMatch,
      })

      ;(supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
      })

      // Act: call the function under test
      const result = await updateEntry(entryId, updates)

      // Assert: verify the supabase calls and the returned data
      expect(supabase.auth.getUser).toHaveBeenCalledTimes(1)
      expect(supabase.from).toHaveBeenCalledWith('entries')
      expect(mockUpdate).toHaveBeenCalledWith(updates)
      expect(mockMatch).toHaveBeenCalledWith({ id: entryId, user_id: mockUserId })
      expect(result).toEqual(mockUpdatedEntry)
    })

    it('updates multiple fields at once', async () => {
      const updates = { title: 'New Title', content: 'New Content' }
      const mockUpdatedEntry = {
        id: entryId,
        user_id: mockUserId,
        title: 'New Title',
        content: 'New Content',
        created_at: '2025-10-31T10:00:00Z',
      }

      const mockSingle = jest.fn().mockResolvedValue({
        data: mockUpdatedEntry,
        error: null,
      })

      const mockMatch = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: mockSingle,
        }),
      })

      const mockUpdate = jest.fn().mockReturnValue({
        match: mockMatch,
      })

      ;(supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
      })

      const result = await updateEntry(entryId, updates)

      expect(mockUpdate).toHaveBeenCalledWith(updates)
      expect(result).toEqual(mockUpdatedEntry)
    })
  })

  describe('authentication failures', () => {
    it('throws an error when user is not authenticated', async () => {
      // Override the default mock to simulate no authenticated user
      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      })

      await expect(
        updateEntry(entryId, { title: 'New Title' })
      ).rejects.toThrow('User not authenticated')

      // Verify that no database query was attempted
      expect(supabase.from).not.toHaveBeenCalled()
    })
  })

  describe('validation errors', () => {
    it('throws an error when updates object is empty', async () => {
      await expect(
        updateEntry(entryId, {})
      ).rejects.toThrow('No updates provided')

      // Verify that no database query was attempted
      expect(supabase.from).not.toHaveBeenCalled()
    })

    it('throws an error when updates is null', async () => {
      await expect(
        updateEntry(entryId, null as any)
      ).rejects.toThrow('No updates provided')

      expect(supabase.from).not.toHaveBeenCalled()
    })
  })

  describe('database errors', () => {
    it('throws when Supabase returns an error', async () => {
      const dbError = new Error('Entry not found')

      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: dbError,
      })

      const mockMatch = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: mockSingle,
        }),
      })

      const mockUpdate = jest.fn().mockReturnValue({
        match: mockMatch,
      })

      ;(supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
      })

      await expect(
        updateEntry(entryId, { title: 'New Title' })
      ).rejects.toThrow('Entry not found')
    })

    it('throws when trying to update another user\'s entry (match returns no rows)', async () => {
      // Supabase will return an error when .single() finds no matching rows
      const noRowsError = new Error('No rows found')

      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: noRowsError,
      })

      const mockMatch = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: mockSingle,
        }),
      })

      const mockUpdate = jest.fn().mockReturnValue({
        match: mockMatch,
      })

      ;(supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
      })

      await expect(
        updateEntry(entryId, { title: 'Hacked Title' })
      ).rejects.toThrow('No rows found')
    })
  })

  describe('security: ownership validation', () => {
    it('only updates entries that match both id AND user_id', async () => {
      const updates = { title: 'Updated' }

      const mockSingle = jest.fn().mockResolvedValue({
        data: { id: entryId, user_id: mockUserId, title: 'Updated', content: 'Content', created_at: '2025-10-31T10:00:00Z' },
        error: null,
      })

      const mockMatch = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: mockSingle,
        }),
      })

      const mockUpdate = jest.fn().mockReturnValue({
        match: mockMatch,
      })

      ;(supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
      })

      await updateEntry(entryId, updates)

      // Verify that the match clause includes BOTH id and user_id
      // This ensures a user cannot update another user's entry even if they know the ID
      expect(mockMatch).toHaveBeenCalledWith({ id: entryId, user_id: mockUserId })
    })
  })
})

// Optional: Add tests for getEntry as well
describe('getEntry', () => {
  const mockUserId = 'user-123'
  const entryId = 'entry-456'

  beforeEach(() => {
    jest.clearAllMocks()

    ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: mockUserId } },
      error: null,
    })
  })

  it('fetches a single entry by id for the authenticated user', async () => {
    const mockEntry = {
      id: entryId,
      user_id: mockUserId,
      title: 'Test Entry',
      content: 'Test content',
      created_at: '2025-10-31T10:00:00Z',
    }

    const mockSingle = jest.fn().mockResolvedValue({
      data: mockEntry,
      error: null,
    })

    const mockMatch = jest.fn().mockReturnValue({
      single: mockSingle,
    })

    const mockSelect = jest.fn().mockReturnValue({
      match: mockMatch,
    })

    ;(supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    })

    const result = await getEntry(entryId)

    expect(supabase.from).toHaveBeenCalledWith('entries')
    expect(mockSelect).toHaveBeenCalledWith('*')
    expect(mockMatch).toHaveBeenCalledWith({ id: entryId, user_id: mockUserId })
    expect(result).toEqual(mockEntry)
  })

  it('throws when user is not authenticated', async () => {
    ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: null,
    })

    await expect(getEntry(entryId)).rejects.toThrow('User not authenticated')
  })

  it('throws when entry is not found or does not belong to user', async () => {
    const notFoundError = new Error('Entry not found')

    const mockSingle = jest.fn().mockResolvedValue({
      data: null,
      error: notFoundError,
    })

    const mockMatch = jest.fn().mockReturnValue({
      single: mockSingle,
    })

    const mockSelect = jest.fn().mockReturnValue({
      match: mockMatch,
    })

    ;(supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    })

    await expect(getEntry(entryId)).rejects.toThrow('Entry not found')
  })
})
