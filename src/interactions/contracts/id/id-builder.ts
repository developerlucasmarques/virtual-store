export type Id = {
  id: string
}

export interface IdBuilder {
  build: () => Id
}
