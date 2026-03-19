import mongoose from 'mongoose';

const markSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    ia1: { type: Number, default: 0 },
    ia2: { type: Number, default: 0 },
    ia3: { type: Number, default: 0 },
    sem: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    published: { type: Boolean, default: false }
  },
  { timestamps: true }
);

markSchema.pre('save', function calcTotal(next) {
  this.total = Number(this.ia1 || 0) + Number(this.ia2 || 0) + Number(this.ia3 || 0) + Number(this.sem || 0);
  next();
});

export default mongoose.model('Mark', markSchema);
