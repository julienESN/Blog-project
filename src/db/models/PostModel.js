import BaseModel from "@/db/models/BaseModel"

class PostModel extends BaseModel {
  static tableName = "posts"

  static get jsonSchema() {
    return {
      type: "object",
      required: ["authorId", "title", "content"],
      properties: {
        id: { type: "integer" },
        authorId: { type: "integer" },
        title: { type: "string", minLength: 1, maxLength: 255 },
        content: { type: "string", minLength: 1 },
      },
    }
  }

  static get relationMappings() {
    return {
      author: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: () => require("./UserModel").default,
        join: {
          from: "posts.author_id",
          to: "users.id",
        },
      },
    }
  }
}

export default PostModel
