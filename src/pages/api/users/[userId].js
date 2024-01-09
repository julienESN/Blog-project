import { validate } from "@/api/middlewares/validate"
import { NotFoundError } from "@/api/errors"
import auth from "@/api/middlewares/auth"
import mw from "@/api/mw"
import {
  userIdValidator,
  emailValidator,
  passwordValidator,
  usernameValidator,
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
    async ({ models: { UserModel }, session, input: { body }, req, res }) => {
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

  DELETE: [
    auth,
    validate({
      params: {
        userId: userIdValidator,
      },
    }),
    async ({
      models: { UserModel },
      input: {
        params: { userId },
      },
      res,
    }) => {
      await UserModel.query().deleteById(userId)
      res.status(204).send()
    },
  ],
})

export default handle
