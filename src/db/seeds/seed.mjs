import { hashPassword } from "../../utils/passwordUtils.mjs"
import { faker } from "@faker-js/faker"

const ADMIN_EMAIL = "admin@example.com"
const ADMIN_USERNAME = "adminUser"
const DEFAULT_PASSWORD = "motDePasseParDefaut91!"
const USER_COUNT = 10
const POSTS_PER_USER = 25
const COMMENTS_PER_POST = 3

async function generateAdminUser() {
  const [passwordHash, passwordSalt] = await hashPassword("Nine1000School2023!")

  return {
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL,
    passwordHash,
    passwordSalt,
    role: "admin",
    isActive: true,
  }
}

async function generateUsers() {
  const passwordHashSaltPairs = await Promise.all(
    Array.from({ length: USER_COUNT }, async () => {
      const [passwordHash, passwordSalt] = await hashPassword(DEFAULT_PASSWORD)

      return [passwordHash, passwordSalt]
    }),
  )

  return passwordHashSaltPairs.map(([passwordHash, passwordSalt]) => ({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    passwordHash,
    passwordSalt,
    role: "user",
    isActive: faker.datatype.boolean(),
  }))
}

function generatePosts(userIds) {
  return userIds.flatMap((userId) =>
    Array.from({ length: POSTS_PER_USER }, () => ({
      authorId: userId,
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(),
      visitCount: faker.number.int({ min: 0, max: 1000 }),
    })),
  )
}

function generateComments(postIds, userIds) {
  return postIds.flatMap((postId) =>
    Array.from({ length: COMMENTS_PER_POST }, () => ({
      userId: userIds[faker.number.int({ min: 0, max: USER_COUNT - 1 })],
      postId,
      content: faker.lorem.sentences(),
    })),
  )
}

export const seed = async (knex) => {
  await knex("comments").del()
  await knex("posts").del()
  await knex("users").del()

  const adminUser = await generateAdminUser()
  const users = await generateUsers()
  const insertedUsers = await knex("users")
    .insert([adminUser, ...users])
    .returning("id")
  const userIds = insertedUsers.map((row) => row.id)
  const posts = generatePosts(userIds)
  const insertedPosts = await knex("posts").insert(posts).returning("id")
  const postIds = insertedPosts.map((row) => row.id)
  const comments = generateComments(postIds, userIds)
  await knex("comments").insert(comments)
}
