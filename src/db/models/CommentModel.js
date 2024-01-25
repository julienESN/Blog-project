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
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: () => require("./UserModel").default,
        join: {
          from: "comments.userId",
          to: "users.id",
        },
      },
      post: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: () => require("./PostModel").default,
        join: {
          from: "comments.postId",
          to: "posts.id",
        },
      },
    }
  }
}

export default CommentModel
