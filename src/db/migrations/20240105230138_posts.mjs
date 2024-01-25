export const up = (knex) =>
  knex.schema.createTable("posts", (table) => {
    table.increments("id").primary()
    table
      .integer("authorId")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
    table.string("title").notNullable()
    table.text("content").notNullable()
    table.integer("visitCount").unsigned().defaultTo(0)
    table.timestamps(true, true)
  })

export const down = (knex) => knex.schema.dropTable("posts")
