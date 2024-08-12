import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users_addresses", (table) => {
    table.uuid("user_address_id").unique().primary().notNullable();
    table.increments("id").unique().notNullable();
    table
      .uuid("address_uuid")
      .references("address_id")
      .inTable("addresses")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

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
  await knex.schema.dropTable("users_addresses");
}
