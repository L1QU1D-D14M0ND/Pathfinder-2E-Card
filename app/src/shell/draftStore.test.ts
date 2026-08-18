// @vitest-environment jsdom
import 'fake-indexeddb/auto'
import { afterEach, describe, expect, it } from 'vitest'
import { clearDraft, DRAFT_DB, readDraft, writeDraft } from './draftStore'

afterEach(async () => {
  await clearDraft()
  indexedDB.deleteDatabase(DRAFT_DB)
})

describe('draftStore', () => {
  it('writes, reads, and clears the one-key IndexedDB draft', async () => {
    expect(await readDraft()).toBeUndefined()

    await writeDraft('{"system":"pf1e"}')
    expect(await readDraft()).toBe('{"system":"pf1e"}')

    await clearDraft()
    expect(await readDraft()).toBeUndefined()
  })
})
