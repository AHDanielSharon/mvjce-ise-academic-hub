import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    description: String,
    deadline: { type: Date, required: true },
    instructionFileUrl: String,
    section: { type: String, enum: ['ISE 4A', 'ISE 4B'], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Assignment', assignmentSchema);
