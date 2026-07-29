import type { TherapeuticStep } from './TherapeuticStep'

export interface TherapeuticExercise {
  id: string
  title: string
  description: string
  steps: TherapeuticStep[]
}
