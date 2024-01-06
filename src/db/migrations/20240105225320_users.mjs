export const up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary()
    table.string("username").notNullable().unique()
    table.string("email").notNullable().unique()
    table.string("password").notNullable()
    table.text("passwordHash").notNullable()
    table.text("passwordSalt").notNullable()
    table.string("role").defaultTo("user")
    table.boolean("is_active").defaultTo(true)
    table.timestamps(true, true)
  })
}

export const down = function (knex) {
  return knex.schema.dropTable("users")
}
