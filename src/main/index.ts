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
import { ApplicationException } from "@/app/errors/application-error";

async function bootstrap() {
  const { container } = makeDependencyInjections();

  const schema = await buildSchema({
    resolvers: [
      UsersResolver,
      SignInResolver,
      CreateUserResolver,
      PublicUsersResolver,
    ],
    container: { get: (cls) => container.resolve(cls) },
    emitSchemaFile: resolve(__dirname, "..", "..", "graphql/schema.graphql"),
    validate: { always: true },
    authChecker,
  });

  const server = new ApolloServer({
    schema,

    formatError: (formatted, err: any) => {
      const isProgrammatic = formatted.message.includes(
        ApplicationException.name
      );

      const isProduction = process.env.NODE_ENV;

      const getErrors = () => {
        const message = isProgrammatic ? formatted.message : "UNEXPECTED_ERROR";
        if (isProduction && isProgrammatic) {
          const error = err.errors ? err : {};
          return {
            message,
            error,
          };
        }

        return { message: formatted.message, error: err };
      };

      const result = getErrors();

      return result;
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
