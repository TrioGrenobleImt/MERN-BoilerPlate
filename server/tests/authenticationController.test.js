import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import request from 'supertest'

beforeAll(async () => {
  //Connect to database
  await mongoose.connect(process.env.MONG_URI)
})

afterAll(async () => {
  //Disconnect from database
  await mongoose.disconnect()
})
