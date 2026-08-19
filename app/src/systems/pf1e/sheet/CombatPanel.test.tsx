// @vitest-environment jsdom
import { useMemo, useState } from 'react'
import { fireEvent, render, screen, cleanup } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { I18nProvider } from '../../../shared/i18n'
import { createEmptyCharacter } from '../character'
import { computeCharacter } from '../engine'
import { CombatPanel } from './CombatPanel'
import type { SheetUpdate } from './update'

function CombatHarness() {
  const [character, setCharacter] = useState(createEmptyCharacter)
  const derived = useMemo(() => computeCharacter(character), [character])
  const update: SheetUpdate = (mutator) => {
    setCharacter((current) => mutator(current))
  }
  return (
    <CombatPanel character={character} derived={derived} update={update} />
  )
}

describe('CombatPanel', () => {
  afterEach(cleanup)

  it('recomputes derived AC when an AC bucket changes', () => {
    render(
      <I18nProvider>
        <CombatHarness />
      </I18nProvider>,
    )

    expect(screen.getByText('10 / 10 / 10')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Armor bonus'), {
      target: { value: '4' },
    })

    expect(screen.getByText('14 / 10 / 14')).toBeInTheDocument()
  })

  it('uses Spanish AC labels from es.json', () => {
    render(
      <I18nProvider initialLocale="es">
        <CombatHarness />
      </I18nProvider>,
    )
    fireEvent.change(screen.getByLabelText('Bonif. de armadura'), {
      target: { value: '4' },
    })
    expect(screen.getByText('14 / 10 / 14')).toBeInTheDocument()
  })
})
