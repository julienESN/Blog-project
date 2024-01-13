import { validate } from "@/api/middlewares/validate"
import { NotFoundError, ForbiddenError, UnauthorizedError } from "@/api/errors"
import auth from "@/api/middlewares/auth"
import mw from "@/api/mw"
import {
  userIdValidator,
  emailValidator,
  passwordValidator,
  usernameValidator,
  isActiveValidator,
} from "@/utils/validators"

const handle = mw({
  GET: [
    auth,
    validate({
      params: {
        userId: userIdValidator,
      },
    }),
    async ({ models: { UserModel }, session, res }) => {
      const userId = session.id
      const user = await UserModel.query().findById(userId)

      if (!user) {
        throw new NotFoundError("User not found")
      }

      res.send(user)
    },
  ],

  PATCH: [
    auth,
    validate({
      body: {
        username: usernameValidator.optional(),
        email: emailValidator.optional(),
        password: passwordValidator.optional(),
      },
    }),
    async ({ models: { UserModel }, session, input: { body }, res }) => {
      const userId = session.id
      const userToUpdate = await UserModel.query().findById(userId)

      if (!userToUpdate) {
        throw new NotFoundError("User not found")
      }

      const updatedFields = { ...body }
      const updatedUser = await UserModel.query().patchAndFetchById(
        userId,
        updatedFields,
      )

      res.send(updatedUser)
    },
  ],

  PUT: [
    auth,
    validate({
      query: {
        userId: userIdValidator,
      },
      body: {
        username: usernameValidator.optional(),
        email: emailValidator.optional(),
        password: passwordValidator.optional(),
        isActive: isActiveValidator,
      },
    }),
    async ({ models: { UserModel }, input: { body, query }, session, res }) => {
      if (session.role !== "admin") {
        throw new UnauthorizedError("Access denied: User is not an admin.")
      }

      const userIdToUpdate = query.userId
      const userToUpdate = await UserModel.query().findById(userIdToUpdate)

      if (!userToUpdate) {
        throw new NotFoundError("User not found")
      }

      const updatedFields = { ...body }

      if ("isActive" in body) {
        updatedFields.isActive = body.isActive
      }

      const updatedUser = await UserModel.query().patchAndFetchById(
        userIdToUpdate,
        updatedFields,
      )

      res.send(updatedUser)
    },
  ],

  DELETE: [
    auth,
    validate({
      query: {
        userId: userIdValidator,
      },
    }),
    async (ctx) => {
      const {
        models: { UserModel },
        input: {
          query: { userId },
        },
        session,
        res,
      } = ctx

      if (session.role !== "admin") {
        throw new UnauthorizedError("Access denied: User is not an admin.")
      }

      const userToDelete = await UserModel.query().findById(userId)

      if (!userToDelete) {
        throw new NotFoundError("User not found")
      }

      if (userToDelete.role === "admin") {
        throw new ForbiddenError("Cannot delete an admin user.")
      }

      await UserModel.query().deleteById(userId)
      res.status(204).send()
    },
  ],
})

export default handle
