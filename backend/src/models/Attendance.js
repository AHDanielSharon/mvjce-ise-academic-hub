import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    section: { type: String, required: true, enum: ['ISE 4A', 'ISE 4B'] },
    subject: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD for easy daily upsert
    takenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    entries: [
      {
        studentUsn: { type: String, required: true },
        studentName: { type: String, required: true },
        present: { type: Boolean, default: false }
      }
    ]
  },
  { timestamps: true }
);

attendanceSchema.index({ section: 1, subject: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
