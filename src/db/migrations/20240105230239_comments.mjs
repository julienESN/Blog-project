export const up = (knex) =>
  knex.schema.createTable("comments", (table) => {
    table.increments("id").primary()
    table
      .integer("userId")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
    table
      .integer("postId")
      .unsigned()
      .references("id")
      .inTable("posts")
      .onDelete("CASCADE")
    table.text("content").notNullable()
    table.timestamps(true, true)
  })

export const down = (knex) => knex.schema.dropTable("comments")
