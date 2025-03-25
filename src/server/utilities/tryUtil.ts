export interface tryUtilI <T> {
  callback: () => void
  retError: (err: string) => T
  retSuccess: T
}

export const tryUtil = <T>({ callback, retSuccess, retError }: tryUtilI<T>): T => {
  try {
    callback()
    return retSuccess
  } catch(err: unknown) {
    console.error(err)
    return err instanceof Error ? retError(err.message) : retError('Unexpected error')
  }
}