import { TokenService } from "@/app/contracts/services/token.service";
import { sign } from "jsonwebtoken";
import { injectable } from "tsyringe";

@injectable()
export class JWTTokenService implements TokenService {
  generateToken(payload: Record<string, any>): string {
    return sign(payload, process.env.TOKEN_KEY);
  }
  verifyToken<P = Record<string, any>>(token: string): Promise<P> {
    throw new Error("Method not implemented.");
  }
}
