import mongoose from 'mongoose'
import { describe, it, beforeAll, afterAll } from 'vitest'
import 'dotenv/config'
import request from 'supertest'

beforeAll(async () => {
  //Connect to database
  await mongoose.connect(process.env.MONG_URI)
})

afterAll(async () => {
  //Disconnect from database
  await mongoose.disconnect()
})

describe('Register', () => {
  it('should create an account and stock __access__token into the cookies', async () => {})
})
