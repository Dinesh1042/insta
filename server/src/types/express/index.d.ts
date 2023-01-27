declare namespace Express {
  export interface Request {
    user: import('../../interfaces/AuthTokenPayload').default;
  }
}
