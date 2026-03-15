import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['announcement', 'assignment', 'resource', 'system'], default: 'system' },
    recipientRole: {
      type: String,
      enum: ['student', 'teacher', 'lab_instructor', 'department_admin', 'hod', 'all'],
      default: 'all'
    },
    recipientSection: { type: String, enum: ['ISE 4A', 'ISE 4B', 'all'], default: 'all' }
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
