export const up = async (knex) => {
  return knex.schema.createTable("posts", function (table) {
    table.increments("id").primary()
    table
      .integer("author_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
    table.string("title").notNullable()
    table.text("content").notNullable()
    table.timestamps(true, true)
  })
}

export const down = async (knex) => {
  return knex.schema.dropTable("posts")
}
