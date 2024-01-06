import BaseModel from "@/db/models/BaseModel";

class PostModel extends BaseModel {
  static tableName = "posts";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["author_id", "title", "content"],
      properties: {
        id: { type: "integer" },
        author_id: { type: "integer" },
        title: { type: "string", minLength: 1, maxLength: 255 },
        content: { type: "string", minLength: 1 },
      },
    };
  }

  static get relationMappings() {
    const UserModel = require("./UserModel");

    return {
      author: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "posts.author_id",
          to: "users.id",
        },
      },
    };
  }
}

export default PostModel;
