export abstract class TokenService {
  abstract generateToken(payload: Record<string, any>): string;
  abstract verifyToken<P = Record<string, any>>(token: string): Promise<P>;
}
