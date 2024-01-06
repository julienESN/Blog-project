export const up = async (knex) => {
  return knex.schema.createTable("comments", function (table) {
    table.increments("id").primary()
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
    table
      .integer("post_id")
      .unsigned()
      .references("id")
      .inTable("posts")
      .onDelete("CASCADE")
    table.text("content").notNullable()
    table.timestamps(true, true)
  })
}

export const down = async (knex) => {
  return knex.schema.dropTable("comments")
}
