export const up = (knex) =>
  knex.schema.createTable("posts", (table) => {
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

export const down = (knex) => knex.schema.dropTable("posts")
