import mongoose from 'mongoose'

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONG_URI)
    console.log('Connected to the database 🧰')
  } catch (err) {
    console.error(err)
  }
}
