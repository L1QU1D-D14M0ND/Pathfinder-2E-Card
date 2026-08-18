/** One IndexedDB record. Not a character library. */
export const DRAFT_DB = 'ttrpg-character-sheet'
export const DRAFT_STORE = 'kv'
export const DRAFT_KEY = 'draft'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DRAFT_DB, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(DRAFT_STORE)) {
        db.createObjectStore(DRAFT_STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'))
  })
}

function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(DRAFT_STORE, mode)
        const req = run(tx.objectStore(DRAFT_STORE))
        req.onsuccess = () => resolve(req.result)
        req.onerror = () =>
          reject(req.error ?? new Error('IndexedDB request failed'))
      }),
  )
}

/** Missing DB, private mode, or a failed read → `undefined`. */
export async function readDraft(): Promise<string | undefined> {
  if (typeof indexedDB === 'undefined') return undefined
  try {
    const value = await withStore('readonly', (store) => store.get(DRAFT_KEY))
    return typeof value === 'string' ? value : undefined
  } catch {
    return undefined
  }
}

export async function writeDraft(json: string): Promise<void> {
  if (typeof indexedDB === 'undefined') return
  try {
    await withStore('readwrite', (store) => store.put(json, DRAFT_KEY))
  } catch {
    // Private mode / quota: Save/Load files still work.
  }
}

export async function clearDraft(): Promise<void> {
  if (typeof indexedDB === 'undefined') return
  try {
    await withStore('readwrite', (store) => store.delete(DRAFT_KEY))
  } catch {
    // ignore
  }
}
