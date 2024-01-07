export const seed = async (knex) => {
  await knex("comments").del()
  await knex("posts").del()
  await knex("users").del()

  await knex("users").insert([
    {
      username: "john_doe",
      email: "john@example.com",
      passwordHash: "hash",
      passwordSalt: "salt",
      role: "user",
      is_active: true,
    },
  ])

  await knex("posts").insert([
    {
      author_id: 1,
      title: "Sample Post 1",
      content: "This is the content of the first post.",
    },
  ])

  await knex("comments").insert([
    { user_id: 1, post_id: 1, content: "Great post!" },
  ])
}
