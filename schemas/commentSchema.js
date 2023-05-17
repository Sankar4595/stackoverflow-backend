const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Questions",
    },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    user: Object,
  },
  {
    versionKey: false,
  }
);

const CommentModel = mongoose.model("Comments", commentSchema);

module.exports = CommentModel;
