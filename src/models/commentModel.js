const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let SchemaTypes = Schema.Types;

const CommentSchema = new Schema(
  {
    text: {
      type: SchemaTypes.String,
      maxLength: 999,
      required: false,
    },
    media: {
      type: [SchemaTypes.String],
      required: false,
    },
    is_deleted: {
      type: SchemaTypes.Boolean,
      default: false,
      required: true,
    },
    is_active: {
      type: SchemaTypes.Boolean,
      default: false,
      required: true,
    },
    post: {
      type: SchemaTypes.ObjectId,
      ref: "Posts",
    },
    last_update_from_user: {
      type: SchemaTypes.ObjectId,
    },
  },
  { collection: "Comments", timestamps: true },
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
