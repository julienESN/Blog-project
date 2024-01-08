import BaseModel from "@/db/models/BaseModel"
class UserModel extends BaseModel {
  static tableName = "users"

  static get jsonSchema() {
    return {
      type: "object",
      required: ["username", "email", "passwordHash", "passwordSalt"],
      properties: {
        id: { type: "integer" },
        username: { type: "string", minLength: 1, maxLength: 255 },
        email: { type: "string", minLength: 1, maxLength: 255 },
        passwordHash: { type: "string" },
        passwordSalt: { type: "string" },
        role: { type: "string", default: "user" },
        is_active: { type: "boolean", default: true },
      },
    }
  }
}

export default UserModel
