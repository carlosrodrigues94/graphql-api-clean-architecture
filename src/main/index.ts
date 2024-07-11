import "reflect-metadata";
import { config } from "dotenv";
config();
import { ApolloServer } from "apollo-server";
import { resolve } from "path";
import { buildSchema } from "type-graphql";
import { UsersResolver } from "@/presentation/graphql/resolvers/users.resolver";
import { makeDependencyInjections } from "@/main/container";

async function bootstrap() {
  const { container } = makeDependencyInjections();

  const schema = await buildSchema({
    resolvers: [UsersResolver],
    container: { get: (cls) => container.resolve(cls) },
    emitSchemaFile: resolve(__dirname, "schema.graphql"),
    validate: { always: true },
  });

  const server = new ApolloServer({
    schema,
  });

  server.listen().catch((err) => console.log(err));
}

bootstrap();
