import { FirebaseError } from 'firebase/app'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { handleServerError } from './handle-server-error'

const toastError = vi.hoisted(() => vi.fn())

vi.mock('sonner', () => ({
  toast: {
    error: toastError,
  },
}))

beforeEach(() => {
  vi.mocked(toastError).mockClear()
})

describe('handleServerError', () => {
  it('shows a generic message when the error is not recognised', () => {
    handleServerError(new Error('network'))

    expect(toastError).toHaveBeenCalledWith('Something went wrong!')
  })

  it('maps a known Firebase error code to a friendly message', () => {
    handleServerError(
      new FirebaseError('permission-denied', 'Missing or insufficient permissions.')
    )

    expect(toastError).toHaveBeenCalledWith(
      'You do not have permission to do that.'
    )
  })

  it('falls back to the generic message for unknown Firebase codes', () => {
    handleServerError(new FirebaseError('some/unknown-code', 'boom'))

    expect(toastError).toHaveBeenCalledWith('Something went wrong!')
  })

  it('logs the error to the console in development', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const err = new Error('logged')

    handleServerError(err)

    expect(log).toHaveBeenCalledTimes(1)
    expect(log).toHaveBeenCalledWith(err)

    log.mockRestore()
  })

  it('does not log the error to the console in production', () => {
    vi.stubEnv('DEV', false)

    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const err = new Error('not logged')

    handleServerError(err)

    expect(log).not.toHaveBeenCalled()

    log.mockRestore()
  })
})
