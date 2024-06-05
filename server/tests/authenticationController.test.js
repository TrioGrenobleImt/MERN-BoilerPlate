import mongoose from 'mongoose'
import { describe, it, beforeAll, afterAll } from 'vitest'

beforeAll(async () => {
  //Connect to database
  await mongoose.connect(process.env.MONG_URI)
})

afterAll(async () => {
  //Disconnect from database
  await mongoose.disconnect()
})
