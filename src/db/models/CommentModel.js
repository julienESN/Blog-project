import BaseModel from "@/db/models/BaseModel"

class CommentModel extends BaseModel {
  static tableName = "comments"

  static get jsonSchema() {
    return {
      type: "object",
      required: ["userId", "postId", "content"],
      properties: {
        id: { type: "integer" },
        userId: { type: "integer" },
        postId: { type: "integer" },
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
