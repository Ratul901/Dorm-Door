import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'superAdmin'],
      default: 'student',
    },
    accountStatus: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    assignedDorm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dorm',
    },
    paymentStatus: {
      type: String,
      enum: ['Not Submitted', 'Pending', 'Approved', 'Paid', 'Rejected'],
      default: 'Not Submitted',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Prefer not to say'],
      default: 'Prefer not to say',
    },
    studentId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    phone: String,
    department: String,
    university: String,
    address: String,
    profileImage: String,
    emergencyContact: {
      name: String,
      relation: String,
      phone: String,
    },
    settings: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  },
)

userSchema.pre('save', async function passwordHashHook(next) {
  if (!this.isModified('password')) {
    return next()
  }

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

export const User = mongoose.model('User', userSchema)
