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

  it('stamps trip and monk together on a kama', () => {
    render(
      <I18nProvider>
        <InventoryHarness />
      </I18nProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add item' }))
    fireEvent.change(screen.getByLabelText('CRB item'), {
      target: { value: 'weapon.kama' },
    })
    expect(screen.getByText('trip')).toBeInTheDocument()
    expect(screen.getByText('monk')).toBeInTheDocument()
    expect(screen.queryByText('reach')).not.toBeInTheDocument()
    expect(screen.queryByText('brace')).not.toBeInTheDocument()
  })

  it('stamps reach and trip together on a guisarme', () => {
    render(
      <I18nProvider>
        <InventoryHarness />
      </I18nProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add item' }))
    fireEvent.change(screen.getByLabelText('CRB item'), {
      target: { value: 'weapon.guisarme' },
    })
    expect(screen.getByText('reach')).toBeInTheDocument()
    expect(screen.getByText('trip')).toBeInTheDocument()
  })

  it('stamps disarm and monk together on a nunchaku', () => {
    render(
      <I18nProvider>
        <InventoryHarness />
      </I18nProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add item' }))
    fireEvent.change(screen.getByLabelText('CRB item'), {
      target: { value: 'weapon.nunchaku' },
    })
    expect(screen.getByText('disarm')).toBeInTheDocument()
    expect(screen.getByText('monk')).toBeInTheDocument()
    expect(screen.queryByText('reach')).not.toBeInTheDocument()
    expect(screen.queryByText('trip')).not.toBeInTheDocument()
  })

  it('stamps a single monk tag on a siangham', () => {
    render(
      <I18nProvider>
        <InventoryHarness />
      </I18nProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add item' }))
    fireEvent.change(screen.getByLabelText('CRB item'), {
      target: { value: 'weapon.siangham' },
    })
    expect(screen.getByText('monk')).toBeInTheDocument()
    expect(screen.queryByText('trip')).not.toBeInTheDocument()
    expect(screen.queryByText('disarm')).not.toBeInTheDocument()
  })

  it('stamps reach, trip, disarm, and nonlethal together on a whip', () => {
    render(
      <I18nProvider>
        <InventoryHarness />
      </I18nProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add item' }))
    fireEvent.change(screen.getByLabelText('CRB item'), {
      target: { value: 'weapon.whip' },
    })
    expect(screen.getByText('reach')).toBeInTheDocument()
    expect(screen.getByText('trip')).toBeInTheDocument()
    expect(screen.getByText('disarm')).toBeInTheDocument()
    expect(screen.getByText('nonlethal')).toBeInTheDocument()
  })

  it('stamps a single double tag on a two-bladed sword', () => {
    render(
      <I18nProvider>
        <InventoryHarness />
      </I18nProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add item' }))
    fireEvent.change(screen.getByLabelText('CRB item'), {
      target: { value: 'weapon.two-bladed-sword' },
    })
    expect(screen.getByText('double')).toBeInTheDocument()
    expect(screen.queryByText('trip')).not.toBeInTheDocument()
    expect(screen.queryByText('brace')).not.toBeInTheDocument()
  })

  it('stamps monk and double together on a quarterstaff', () => {
    render(
      <I18nProvider>
        <InventoryHarness />
      </I18nProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add item' }))
    fireEvent.change(screen.getByLabelText('CRB item'), {
      target: { value: 'weapon.quarterstaff' },
    })
    expect(screen.getByText('monk')).toBeInTheDocument()
    expect(screen.getByText('double')).toBeInTheDocument()
  })

  it('stamps a single nonlethal tag on a sap', () => {
    render(
      <I18nProvider>
        <InventoryHarness />
      </I18nProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add item' }))
    fireEvent.change(screen.getByLabelText('CRB item'), {
      target: { value: 'weapon.sap' },
    })
    expect(screen.getByText('nonlethal')).toBeInTheDocument()
    expect(screen.queryByText('trip')).not.toBeInTheDocument()
    expect(screen.queryByText('reach')).not.toBeInTheDocument()
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
