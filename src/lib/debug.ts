const isDev = process.env.NODE_ENV !== 'production'

export const debug = {
  log: (...args: unknown[]) => { if (isDev) console.log(...args) },
  warn: (...args: unknown[]) => { if (isDev) console.warn(...args) },
}
