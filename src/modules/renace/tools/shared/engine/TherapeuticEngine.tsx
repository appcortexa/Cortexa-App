import { useMemo, useState } from 'react'
import type { TherapeuticExercise } from '../types/TherapeuticExercise'
import { ExerciseRenderer } from './ExerciseRenderer'
import { ProgressIndicator } from './ProgressIndicator'
import { StepNavigator } from './StepNavigator'

interface TherapeuticEngineProps {
  exercise: TherapeuticExercise
}

export function TherapeuticEngine({ exercise }: TherapeuticEngineProps) {
  const [stepIndex, setStepIndex] = useState(0)

  const totalSteps = exercise.steps.length

  const currentStep = useMemo(() => {
    return exercise.steps[stepIndex]
  }, [exercise.steps, stepIndex])

  const canGoPrevious = stepIndex > 0
  const canGoNext = stepIndex < totalSteps - 1

  const handlePrevious = () => {
    if (!canGoPrevious) {
      return
    }

    setStepIndex((previousIndex) => previousIndex - 1)
  }

  const handleNext = () => {
    if (!canGoNext) {
      return
    }

    setStepIndex((previousIndex) => previousIndex + 1)
  }

  return (
    <section>
      <h2>{exercise.title}</h2>
      <p>Paso actual: {currentStep?.title ?? 'Sin pasos disponibles'}</p>

      <ExerciseRenderer />
      <ProgressIndicator currentStep={Math.min(stepIndex + 1, Math.max(totalSteps, 1))} totalSteps={Math.max(totalSteps, 1)} />
      <StepNavigator
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </section>
  )
}
