import mongoose from 'mongoose'
import { describe, it, beforeAll, afterAll, expect, afterEach } from 'vitest'
import 'dotenv/config'
import request from 'supertest'

//Import app
import app from '../server.js'
import User from '../src/models/UserModel.js'

beforeAll(async () => {
  //Connect to database
  await mongoose.connect(process.env.MONG_URI)
})

afterAll(async () => {
  //Disconnect from database
  await mongoose.disconnect()
})

describe('Register', () => {
  it('should create an account and stock the token into the cookies', async () => {
    const response = await request(app).post('/api/auth/register').send({
      username: 'test',
      email: 'test@gmail.com',
      password: 'test',
      confirmPassword: 'test',
    })
    expect(response.status).toBe(200)
    expect(response.headers['set-cookie'][0].startsWith('__access__token=')).toBe(true)
    expect(response.body.message).toBe('Registered succesfully')
    expect(response.body.user).toHaveProperty('_id' && 'username' && 'email')
    expect(response.body.password).toBe(undefined)
  })
  it('should return a 400 status error because the passwords do not match', async () => {
    const response = await request(app).post('/api/auth/register').send({
      username: 'test',
      email: 'test@gmail.com',
      password: 'test',
      confirmPassword: 'test2',
    })
    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Passwords do not match')
  })

  afterEach(async () => {
    if (await User.findOne({ username: 'test' })) {
      await User.deleteOne({ username: 'test' })
    }
  })
})
