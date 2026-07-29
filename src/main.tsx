import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// @ts-expect-error provided by vite-plugin-pwa at build time
import { registerSW } from 'virtual:pwa-register'
import AppRouter from './router/AppRouter'

registerSW()

window.addEventListener('error', (event) => {
  console.error('RENDER_EXCEPTION', {
    file: event.filename,
    line: event.lineno,
    column: event.colno,
    message: event.message,
    stack: event.error instanceof Error ? event.error.stack : undefined,
  })
})

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason as { message?: string; stack?: string } | undefined
  console.error('UNHANDLED_REJECTION', {
    message: reason?.message ?? String(event.reason),
    stack: reason?.stack,
  })
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)