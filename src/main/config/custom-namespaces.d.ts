declare namespace Express {
  interface Request {
    headers: {
      userId?: string
      signature?: string
    }
  }
}
