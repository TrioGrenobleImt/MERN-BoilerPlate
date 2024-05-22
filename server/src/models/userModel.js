import mongoose from 'mongoose'

const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
)

// UserSchema.methods.toJSON = function () {
//   const user = this.toObject()
//   delete user.password
//   return user
// }

export default mongoose.model('User', UserSchema)
