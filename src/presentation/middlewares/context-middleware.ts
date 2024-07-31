import { IncomingMessage } from "http";
import * as JWT from "jsonwebtoken";
import { Knex } from "knex";
const TOKEN_KEY = "token-key";

export class ContextMiddleware {
  private readonly knexClient: Knex;
  private readonly tokenService: typeof JWT;
  constructor(
    private readonly knex: Function,
    private readonly knexConfig: Knex.Config,
    private readonly jwt: typeof JWT
  ) {
    this.knexClient = this.knex(this.knexConfig);
    this.tokenService = this.jwt;
  }

  async checkUser(params: {
    req: IncomingMessage;
  }): Promise<{ user: Record<string, any> | null }> {
    const token = params.req.headers.authorization || "";
    if (!token || !token.includes("Bearer")) {
      return {
        user: null,
      };
    }

    const decoded = this.tokenService.verify(
      token.split("Bearer ")[1],
      TOKEN_KEY
    ) as JWT.JwtPayload;

    const [user] = await this.knexClient
      .table("users")
      .select("*")
      .where({ user_id: decoded.userId })
      .returning("*");

    if (!user) {
      return {
        user: null,
      };
    }

    return { user: { ...user, roles: decoded.roles } };
  }
}
