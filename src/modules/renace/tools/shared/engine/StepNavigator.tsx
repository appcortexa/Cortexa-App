interface StepNavigatorProps {
  canGoPrevious: boolean
  canGoNext: boolean
  onPrevious: () => void
  onNext: () => void
}

export function StepNavigator({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}: StepNavigatorProps) {
  return (
    <div>
      <button type="button" onClick={onPrevious} disabled={!canGoPrevious}>
        Anterior
      </button>
      <button type="button" onClick={onNext} disabled={!canGoNext}>
        Siguiente
      </button>
    </div>
  )
}
