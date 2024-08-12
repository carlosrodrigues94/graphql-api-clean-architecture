import { Knex } from "knex";

export class KnexHandler {
  client: Knex;
  constructor(private readonly knex: Knex) {
    this.client = this.knex;
  }
  async insert(
    table: string,
    data: Record<string, any> | Record<string, any>[]
  ) {
    await this.validateConnections();

    await this.client.table(table).insert(data);
  }

  private async validateConnections() {
    const count = await this.getConnections();

    if (count >= 10) {
      await this.client.destroy();
    }
  }

  private async getConnections(): Promise<number> {
    const result = await this.client.raw(
      `SELECT * FROM pg_stat_activity WHERE datname = '${
        process.env.DATABASE_URL?.split("/")[3]
      }';`
    );
    const count = result.rowCount;

    return count;
  }
}
