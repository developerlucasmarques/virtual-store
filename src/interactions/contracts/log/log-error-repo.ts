export interface LogErrorRepo {
  logError: (stackError: string) => Promise<void>
}
