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
      isActive: true,
    },
    {
      username: "jane_doe",
      email: "jane@example.com",
      passwordHash: "hash",
      passwordSalt: "salt",
      role: "admin",
      isActive: true,
    },
  ])

  await knex("posts").insert([
    {
      authorId: 1,
      title: "Sample Post 1",
      content: "This is the content of the first post.",
    },
  ])

  await knex("comments").insert([
    { userId: 1, postId: 1, content: "Great post!" },
  ])
}
