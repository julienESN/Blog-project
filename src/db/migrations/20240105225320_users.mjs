export function up(knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary()
    table.string("username").notNullable().unique()
    table.string("email").notNullable().unique()
    table.text("passwordHash").notNullable()
    table.text("passwordSalt").notNullable()
    table.string("role").defaultTo("user")
    table.boolean("isActive").defaultTo(true)
    table.timestamps(true, true)
  })
}

export function down(knex) {
  return knex.schema.dropTable("users")
}
