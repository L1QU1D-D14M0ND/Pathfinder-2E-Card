import { describe, expect, it } from 'vitest'
import { PF2E_SYSTEM_ID, resolveSystemId } from './envelope'
import { signed } from './format'

describe('resolveSystemId', () => {
  it('defaults missing and unknown values to pf2e', () => {
    expect(resolveSystemId(undefined)).toBe(PF2E_SYSTEM_ID)
    expect(resolveSystemId('pf2e')).toBe('pf2e')
    expect(resolveSystemId('pf1e')).toBe('pf1e')
  })
})

describe('signed', () => {
  it('prefixes positive numbers', () => {
    expect(signed(3)).toBe('+3')
    expect(signed(0)).toBe('0')
    expect(signed(-2)).toBe('-2')
  })
})
