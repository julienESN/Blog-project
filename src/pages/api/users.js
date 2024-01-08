import { validate } from "@/api/middlewares/validate"
import { NotFoundError } from "@/api/errors"
import auth from "@/api/middlewares/auth"
import { hashPassword } from "@/utils/passwordUtils"
import mw from "@/api/mw"
import {
  emailValidator,
  passwordValidator,
  userIdValidator,
  usernameValidator,
} from "@/utils/validators"

const handle = mw({
  POST: [
    validate({
      body: {
        username: usernameValidator,
        email: emailValidator,
        password: passwordValidator,
      },
    }),
    async ({
      input: {
        body: { username, email, password },
      },
      models: { UserModel },
      res,
    }) => {
      const user = await UserModel.query().findOne({ email })

      if (!user) {
        throw new NotFoundError("User not found")
      }

      const [passwordHash, passwordSalt] = await hashPassword(password)

      await UserModel.query().insertAndFetch({
        username,
        email,
        passwordHash,
        passwordSalt,
      })
      res.send({ result: true })
    },
  ],
  GET: [
    auth,
    validate({
      query: {
        userId: userIdValidator,
      },
    }),
    async ({
      models: { UserModel },
      input: {
        query: { userId },
      },
      res,
    }) => {
      const user = await UserModel.query().findById(userId)
      if (!user) {
        res.status(404).send({ error: "User not found" })
        return
      }
      res.send(user)
    },
  ],
  PUT: [
    auth,
    validate({
      body: {
        email: emailValidator.optional(),
        password: passwordValidator.optional(),
      },
    }),
    async ({
      models: { UserModel },
      input: {
        body,
        params: { userId },
      },
      res,
    }) => {
      const updatedFields = {}

      if (body.email) {
        updatedFields.email = body.email
      }
      if (body.password) {
        const [passwordHash, passwordSalt] = await hashPassword(body.password)
        updatedFields.passwordHash = passwordHash
        updatedFields.passwordSalt = passwordSalt
      }

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
