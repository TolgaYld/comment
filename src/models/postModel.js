const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let SchemaTypes = Schema.Types;

const PostSchema = new Schema(
  {
    comments: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Comments",
      },
    ],
  },
  { collection: "Posts", timestamps: true },
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
