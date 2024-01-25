import BaseModel from "@/db/models/BaseModel"
import CommentModel from "@/db/models/CommentModel"

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
          from: "posts.authorId",
          to: "users.id",
        },
      },
      comments: {
        relation: BaseModel.HasManyRelation,
        modelClass: CommentModel,
        join: {
          from: "posts.id",
          to: "comments.postId",
        },
      },
    }
  }
}

export default PostModel
