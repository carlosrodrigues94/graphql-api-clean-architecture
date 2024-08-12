import knex from "knex";
import { Readable } from "stream";
import knexConfig from "../knex.config";
import { generateData } from "./data";
import { KnexHandler } from "./knex.handler";

class Seeder {
  private BATCH_SIZE = 1000;
  private TOTAL = 10_000;
  private stream: Readable;
  constructor(private readonly client: KnexHandler) {}

  private buildStream() {
    const total = this.TOTAL;
    this.stream = new Readable({
      objectMode: true,
      read() {
        for (let idx = 1; idx <= total; idx++) {
          const { avatar, charge, user } = generateData(idx);
          this.push({ avatar, charge, user });
        }
        this.push(null);
      },
    });
  }

  async insertInBatches() {
    console.log("Building stream");
    this.buildStream();

    let values: Array<{
      users: { data: Record<string, any> };
      users_avatars: { data: Record<string, any> };
      charges: { data: Record<string, any> };
    }> = [];

    let totalInserted = 0;

    try {
      console.log("Inserting");
      for await (const { user, avatar, charge } of this.stream) {
        const value = {
          users: { data: user },
          users_avatars: { data: avatar },
          charges: { data: charge },
        };

        values.push(value);

        if (values.length === this.BATCH_SIZE) {
          await this.insertMany(
            "users",
            values.map((item) => item.users.data)
          );
          await this.insertMany(
            "users_avatars",
            values.map((item) => item.users_avatars.data)
          );
          await this.insertMany(
            "charges",
            values.map((item) => item.charges.data)
          );
          totalInserted += values.length;
          values = [];
          console.log(`Inserted ${totalInserted} users so far.`);
        }
      }

      // Insert remaining users
      if (values.length > 0) {
        await this.insertMany(
          "users",
          values.map((item) => item.users.data)
        );
        await this.insertMany(
          "users_avatars",
          values.map((item) => item.users_avatars.data)
        );
        await this.insertMany(
          "charges",
          values.map((item) => item.charges.data)
        );
        totalInserted += values.length;
      }
    } catch (err) {
      console.log("Error", err);
    }

    if (totalInserted === this.TOTAL) {
      process.exit();
    }
  }

  private async insertMany(table: string, data: Record<string, any>[]) {
    await this.client.insert(table, data);
  }
}

new Seeder(new KnexHandler(knex(knexConfig))).insertInBatches();
