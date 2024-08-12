import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("charges", (table) => {
    table.uuid("charge_id").unique().primary().notNullable();
    table.increments("id").unique().notNullable();
    table.integer("value").notNullable();
    table.string("status", 10).notNullable();
    table.string("currency", 15).notNullable();
    table.string("payment_method", 15).notNullable();
    table.string("payment_provider", 15).notNullable();
    table.string("payment_provider_charge_id").nullable();
    table.jsonb("payment_provider_charge_details").nullable();
    table
      .uuid("user_uuid")
      .references("user_id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    table.datetime("created_at").notNullable();
    table.datetime("updated_at").nullable();
    table.datetime("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("charges");
}
