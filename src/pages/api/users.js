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
    const userExists = await UserModel.query().findOne({ email });

    if (userExists) {
      res.status(400).send({ error: "User already exists" });
      return;
    }

    const [passwordHash, passwordSalt] = await hashPassword(password);

    const newUser = await UserModel.query().insertAndFetch({
      username,
      email,
      passwordHash,
      passwordSalt,
    });
    res.status(201).send(newUser);
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
})

export default handle
