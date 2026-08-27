// @vitest-environment jsdom
import { useMemo, useState } from 'react'
import { fireEvent, render, screen, cleanup } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { I18nProvider } from '../../../shared/i18n'
import { createEmptyCharacter } from '../character'
import { computeCharacter } from '../engine'
import { InventoryPanel } from './InventoryPanel'
import type { SheetUpdate } from './update'

function InventoryHarness() {
  const [character, setCharacter] = useState(createEmptyCharacter)
  const derived = useMemo(() => computeCharacter(character), [character])
  const update: SheetUpdate = (mutator) => {
    setCharacter((current) => mutator(current))
  }
  return (
    <InventoryPanel character={character} derived={derived} update={update} />
  )
}

describe('InventoryPanel weapon properties', () => {
  afterEach(cleanup)

  it('stamps a single brace tag and allows adding a second', () => {
    render(
      <I18nProvider>
        <InventoryHarness />
      </I18nProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add item' }))
    fireEvent.change(screen.getByLabelText('CRB item'), {
      target: { value: 'weapon.spear' },
    })
    expect(screen.getByText('brace')).toBeInTheDocument()
    expect(screen.queryByText('reach')).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Add property'), {
      target: { value: 'trip' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add property' }))
    expect(screen.getByText('brace')).toBeInTheDocument()
    expect(screen.getByText('trip')).toBeInTheDocument()
  })

  it('stamps reach and brace together on a longspear', () => {
    render(
      <I18nProvider>
        <InventoryHarness />
      </I18nProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add item' }))
    fireEvent.change(screen.getByLabelText('CRB item'), {
      target: { value: 'weapon.longspear' },
    })
    expect(screen.getByText('reach')).toBeInTheDocument()
    expect(screen.getByText('brace')).toBeInTheDocument()
  })

  it('can drop back to a single tag', () => {
    render(
      <I18nProvider>
        <InventoryHarness />
      </I18nProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add item' }))
    fireEvent.change(screen.getByLabelText('CRB item'), {
      target: { value: 'weapon.spear' },
    })
    fireEvent.change(screen.getByLabelText('Add property'), {
      target: { value: 'flaming' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add property' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove property brace' }))
    expect(screen.queryByText('brace')).not.toBeInTheDocument()
    expect(screen.getByText('flaming')).toBeInTheDocument()
  })
})
