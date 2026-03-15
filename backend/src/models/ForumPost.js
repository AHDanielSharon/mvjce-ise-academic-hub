import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isHelpful: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const forumPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    question: { type: String, required: true },
    tags: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [answerSchema]
  },
  { timestamps: true }
);

export default mongoose.model('ForumPost', forumPostSchema);
