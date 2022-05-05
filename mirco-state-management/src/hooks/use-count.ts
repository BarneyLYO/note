import { useState } from 'react'

export const useCount = (init: number) => {
  return useState(init)
}
