import { validate } from "@/api/middlewares/validate"
import { UnauthorizedError } from "@/api/errors"
import auth from "@/api/middlewares/auth"
import { hashPassword } from "@/utils/passwordUtils"
import mw from "@/api/mw"
import {
  emailValidator,
  passwordValidator,
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
      try {
        const userExists = await UserModel.query().findOne({ email })

        if (userExists) {
          res.status(400).send({ error: "User already exists" })

          return
        }

        const [passwordHash, passwordSalt] = await hashPassword(password)

        try {
          const newUser = await UserModel.query().insertAndFetch({
            username,
            email,
            passwordHash,
            passwordSalt,
          })
          res.status(201).send(newUser)
        } catch (insertError) {
          res
            .status(500)
            .send({ error: "There was a problem creating the user." })
        }
      } catch (error) {
        res.status(500).send({ error: "Internal server error." })
      }
    },
  ],

  GET: [
    auth,
    async ({ models: { UserModel }, session, res }) => {
      if (session.role !== "admin") {
        throw new UnauthorizedError("Access denied: User is not an admin.")
      }

      const users = await UserModel.query()
      res.send(users)
    },
  ],
})

export default handle
