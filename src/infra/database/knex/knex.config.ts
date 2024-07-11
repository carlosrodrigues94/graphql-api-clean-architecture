import { Knex } from "knex";

export const knexConfig: Knex.Config = {
  client: "pg",
  connection: encodeURI(process.env.DATABASE_URL),
};
