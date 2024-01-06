import config from "@/config"
import BaseModel from "@/db/models/BaseModel"
import { pbkdf2, randomBytes } from "node:crypto"
import { promisify } from "node:util"

const pbkdf2Async = promisify(pbkdf2)

class UserModel extends BaseModel {
  static tableName = "users"

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "username",
        "email",
        "password",
        "passwordHash",
        "passwordSalt",
      ],
      properties: {
        id: { type: "integer" },
        username: { type: "string", minLength: 1, maxLength: 255 },
        email: { type: "string", minLength: 1, maxLength: 255 },
        password: { type: "string", minLength: 1, maxLength: 255 },
        passwordHash: { type: "string" },
        passwordSalt: { type: "string" },
        role: { type: "string", default: "user" },
        is_active: { type: "boolean", default: true },
      },
    }
  }

  static async hashPassword(
    password,
    salt = randomBytes(config.security.password.keylen).toString("hex"),
  ) {
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
}

export default UserModel
