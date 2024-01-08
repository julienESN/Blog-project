import { validate } from "@/api/middlewares/validate"
import { NotFoundError } from "@/api/errors"
import auth from "@/api/middlewares/auth"
import mw from "@/api/mw"
import {
  userIdValidator,
  emailValidator,
  passwordValidator,
} from "@/utils/validators"

const handle = mw({
  GET: [
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
      const user = await UserModel.query().findById(userId)
      if (!user) {
        throw new NotFoundError("User not found")
      }
      res.send(user)
    },
  ],
  PUT: [
    auth,
    validate({
      params: {
        userId: userIdValidator,
      },
      body: {
        email: emailValidator.optional(),
        password: passwordValidator.optional(),
      },
    }),
    async ({
      models: { UserModel },
      input: {
        params: { userId },
        body,
      },
      res,
    }) => {},
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
