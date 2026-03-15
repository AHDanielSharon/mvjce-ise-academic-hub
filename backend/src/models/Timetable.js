import mongoose from 'mongoose';

const timetableEntrySchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    subjectCode: String,
    faculty: String,
    roomNumber: String,
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    type: { type: String, enum: ['class', 'break', 'lunch', 'library', 'counselling'], default: 'class' }
  },
  { _id: false }
);

const timetableSchema = new mongoose.Schema(
  {
    section: { type: String, enum: ['ISE 4A', 'ISE 4B'], required: true },
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], required: true },
    entries: [timetableEntrySchema]
  },
  { timestamps: true }
);

timetableSchema.index({ section: 1, day: 1 }, { unique: true });

export default mongoose.model('Timetable', timetableSchema);
