import BaseModel from "@/db/models/BaseModel"

class CommentModel extends BaseModel {
  static tableName = "comments"

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "post_id", "content"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        post_id: { type: "integer" },
        content: { type: "string", minLength: 1 },
      },
    }
  }

  static get relationMappings() {
    const UserModel = require("./UserModel")
    const PostModel = require("./PostModel")

    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "comments.user_id",
          to: "users.id",
        },
      },
      post: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: PostModel,
        join: {
          from: "comments.post_id",
          to: "posts.id",
        },
      },
    }
  }
}

export default CommentModel
