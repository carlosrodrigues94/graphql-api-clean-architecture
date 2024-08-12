import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("addresses", (table) => {
    table.uuid("address_id").unique().primary().notNullable();
    table.increments("id").unique().notNullable();
    table.string("street").notNullable();
    table.string("neighborhood").notNullable();
    table.string("country").notNullable();
    table.string("zip_code").notNullable();
    table.datetime("created_at").notNullable();
    table.datetime("updated_at").nullable();
    table.datetime("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("addresses");
}
