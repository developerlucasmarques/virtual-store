export interface Decrypter {
  decrypt: (token: string) => Promise<null | string>
}
