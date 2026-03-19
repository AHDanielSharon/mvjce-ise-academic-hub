import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String },
    section: [{ type: String, enum: ['ISE 4A', 'ISE 4B'] }],
    facultyName: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String, default: 'Information Science & Engineering' },
    hasLab: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Subject', subjectSchema);
