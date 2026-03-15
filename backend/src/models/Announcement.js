import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    audience: { type: String, enum: ['all', 'ISE 4A', 'ISE 4B'], default: 'all' }
  },
  { timestamps: true }
);

export default mongoose.model('Announcement', announcementSchema);
