import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("user_id").unique().primary().notNullable();
    table.increments("id").unique().nullable();
    table.string("user_name").notNullable();
    table.string("register_status", 15);
    table.datetime("created_at").notNullable();
    table.datetime("updated_at").nullable();
    table.datetime("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users");
}
