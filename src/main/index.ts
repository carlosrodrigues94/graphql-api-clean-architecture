import "reflect-metadata";
import { config } from "dotenv";
config();
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolve } from "path";
import { buildSchema } from "type-graphql";
import * as JWT from "jsonwebtoken";
import knex from "knex";
import { authChecker } from "@/presentation/graphql/auth/auth-checker";
import { ContextMiddleware } from "@/presentation/middlewares/context-middleware";
import { knexConfig } from "@/infra/database/knex/knex.config";
import { makeDependencyInjections } from "@/main/container";
import { SignInResolver } from "@/presentation/graphql/resolvers/users/sign-in.resolver";
import { CreateUserResolver } from "@/presentation/graphql/resolvers/users/create-user.resolver";
import { PublicUsersResolver } from "@/presentation/graphql/resolvers/users/public-users.resolver";
import { UsersResolver } from "@/presentation/graphql/resolvers/users/users.resolver";

async function bootstrap() {
  const { container } = makeDependencyInjections();

  console.log({
    TOKEN_KEY: process.env.TOKEN_KEY,
    DATABASE_URL: encodeURI(process.env.DATABASE_URL),
  });

  const schema = await buildSchema({
    resolvers: [
      UsersResolver,
      SignInResolver,
      CreateUserResolver,
      PublicUsersResolver,
    ],
    container: { get: (cls) => container.resolve(cls) },
    emitSchemaFile: resolve(__dirname, "schema.graphql"),
    validate: { always: true },
    authChecker,
  });

  const server = new ApolloServer({
    schema,
    formatError: (formatted, error) => {
      return { message: formatted.message };
    },
  });
  const { url } = await startStandaloneServer(server, {
    listen: {
      port: 4000,
    },

    context: async ({ req }) =>
      new ContextMiddleware(knex, knexConfig, JWT).checkUser({ req }),
  });

  console.log("Serving: ", url);
}

bootstrap();
