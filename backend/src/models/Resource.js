import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    type: { type: String, enum: ['notes', 'ppt', 'question-paper', 'assignment', 'link', 'lab-program'], required: true },
    title: { type: String, required: true },
    description: String,
    content: String,
    fileUrl: String,
    linkUrl: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model('Resource', resourceSchema);
