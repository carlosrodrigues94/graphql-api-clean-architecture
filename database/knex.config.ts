import * as dotEnv from "dotenv";
import { Knex } from "knex";
import { resolve } from "path";
dotEnv.config();

const uri = encodeURI(process.env.DATABASE_URL!);
const isProduction = process.env.NODE_ENV;

const config: Knex.Config = {
  client: "pg",
  connection: uri,
  migrations: {
    extension: isProduction ? "js" : "ts",

    directory: resolve(__dirname, "migrations"),
  },
  seeds: {
    directory: resolve(__dirname, "seeds"),
    extension: isProduction ? "js" : "ts",
  },
};

export default config;
