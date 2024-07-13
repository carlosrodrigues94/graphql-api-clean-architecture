import "reflect-metadata";
import { config } from "dotenv";
config();
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolve } from "path";
import { buildSchema } from "type-graphql";
import * as JWT from "jsonwebtoken";
import knex from "knex";
import { UsersResolver } from "@/presentation/graphql/resolvers/users.resolver";
import { authChecker } from "@/presentation/graphql/auth/auth-checker";
import { ContextMiddleware } from "@/presentation/middlewares/context-middleware";
import { knexConfig } from "@/infra/database/knex/knex.config";
import { makeDependencyInjections } from "@/main/container";

async function bootstrap() {
  const { container } = makeDependencyInjections();

  const schema = await buildSchema({
    resolvers: [UsersResolver],
    container: { get: (cls) => container.resolve(cls) },
    emitSchemaFile: resolve(__dirname, "schema.graphql"),
    validate: { always: true },
    authChecker,
  });

  const server = new ApolloServer({
    schema,
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
