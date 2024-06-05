import mongoose from 'mongoose'
import { describe, it, beforeAll, afterAll, expect, afterEach, vitest } from 'vitest'
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
  it('should return a 409 status error because the email is already taken', async () => {
    await User.create({ username: 'test', email: 'test@gmail.com', password: 'test' })
    const response = await request(app).post('/api/auth/register').send({
      username: 'test2',
      email: 'test@gmail.com',
      password: 'test',
      confirmPassword: 'test',
    })
    expect(response.status).toBe(409)
    expect(response.body.error).toBe('This email is already taken')
  })
  it('should return a 409 status error because the username is already taken', async () => {
    await User.create({ username: 'test', email: 'test@gmail.com', password: 'test' })
    const response = await request(app).post('/api/auth/register').send({
      username: 'test',
      email: 'test2@gmail.com',
      password: 'test',
      confirmPassword: 'test',
    })
    expect(response.status).toBe(409)
    expect(response.body.error).toBe('This username is already taken')
  })
  it('should return a 422 status error because of missing fields', async () => {
    const response = await request(app).post('/api/auth/register').send({
      username: 'test',
      password: 'test',
      confirmPassword: 'test',
    })
    expect(response.status).toBe(422)
    expect(response.body.error).toBe('Missing fields')
  })
  it('should return a 500 status error because of an internal error', async () => {
    vitest.spyOn(User, 'findOne').mockImplementationOnce(() => {
      throw new Error('Test error')
    })

    const response = await request(app).post('/api/auth/register').send({
      username: 'test',
      email: 'test@gmail.com',
      password: 'test',
      confirmPassword: 'test',
    })

    expect(response.status).toBe(500)
    expect(response.body.error).toBe('Test error')
  })

  afterEach(async () => {
    if (await User.findOne({ username: 'test' })) {
      await User.deleteOne({ username: 'test' })
    }
  })
})
