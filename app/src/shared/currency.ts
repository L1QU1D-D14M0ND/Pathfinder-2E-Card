export interface Currency {
  cp: number
  sp: number
  gp: number
  pp: number
}

export function emptyCurrency(): Currency {
  return { cp: 0, sp: 0, gp: 0, pp: 0 }
}
