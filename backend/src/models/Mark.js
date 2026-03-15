import mongoose from 'mongoose';

const markSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    test1: { type: Number, default: 0 },
    test2: { type: Number, default: 0 },
    assignments: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  { timestamps: true }
);

markSchema.pre('save', function calcTotal(next) {
  this.total = this.test1 + this.test2 + this.assignments;
  next();
});

export default mongoose.model('Mark', markSchema);
