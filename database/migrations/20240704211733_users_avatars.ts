import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users_avatars", (table) => {
    table.uuid("avatar_id").primary().unique();
    table
      .uuid("user_uuid")
      .notNullable()
      .references("user_id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    table.string("url").notNullable();
    table.datetime("created_at").notNullable();
    table.datetime("updated_at").nullable();
    table.datetime("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users_avatars");
}
