import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    badges: [{ type: String }],
    stats: {
      totalUploads: { type: Number, default: 0 },
      totalViews: { type: Number, default: 0 },
      approvedPapers: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
