import { pbkdf2, randomBytes } from "node:crypto"
import { promisify } from "node:util"
import config from "@/config"

const pbkdf2Async = promisify(pbkdf2)

export const hashPassword = async (
  password,
  salt = randomBytes(config.security.password.keylen).toString("hex"),
) => {
  return [
    (
      await pbkdf2Async(
        password,
        salt + config.security.password.pepper,
        config.security.password.iterations,
        config.security.password.keylen,
        config.security.password.digest,
      )
    ).toString("hex"),
    salt,
  ]
}
