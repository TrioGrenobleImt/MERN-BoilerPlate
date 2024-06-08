import mongoose from 'mongoose'
import { describe, it, beforeAll, afterAll, expect, afterEach, vitest, beforeEach } from 'vitest'
import 'dotenv/config'
import request from 'supertest'

//Import app
import app from '../server.js'
import User from '../src/models/UserModel.js'

beforeAll(async () => {
  //Connect to database
  await mongoose.connect(process.env.MONG_URI_TEST)
})

afterAll(async () => {
  //Disconnect from database
  await mongoose.disconnect()
})

describe('POST /api/auth/register', () => {
  afterEach(async () => {
    await User.deleteMany()
  })

  it('should return a 201 status, create an account and stock the token into the cookies', async () => {
    const response = await request(app).post('/api/auth/register').send({
      username: 'test',
      email: 'test@gmail.com',
      password: 'test',
      confirmPassword: 'test',
    })
    expect(response.status).toBe(201)
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
    expect(response.status).toBe(400)
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
})

describe('POST /api/auth/login', () => {
  afterEach(async () => {
    await User.deleteMany()
  })

  it('should return a 201 status, create an account and stock the token into the cookies', async () => {
    const user = new User({ username: 'test', email: 'test@gmail.com', password: 'testPassword' })
    await user.save()
    const response = await request(app).post('/api/auth/login').send({
      username: 'test',
      password: 'testPassword',
    })

    expect(response.status).toBe(201)
    expect(response.headers['set-cookie'][0].startsWith('__access__token=')).toBe(true)
    expect(response.body.message).toBe('Logged in succesfully')
    expect(response.body.user).toHaveProperty('_id' && 'username' && 'email')
    expect(response.body.password).toBe(undefined)
  })
  it('should return a 422 error status because one of the fields is missing', async () => {
    const user = new User({ username: 'test', email: 'test@gmail.com', password: 'testPassword' })
    await user.save()
    const response = await request(app).post('/api/auth/login').send({
      username: 'test',
    })
    expect(response.status).toBe(422)
    expect(response.body.error).toBe('Missing fields')
  })
  it('should return a 400 error status because there is no user with this username', async () => {
    const user = new User({ username: 'test', email: 'test@gmail.com', password: 'testPassword' })
    await user.save()
    const response = await request(app).post('/api/auth/login').send({
      username: 'testFALSE',
      password: 'testPassword',
    })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Invalid credentials')
  })
})
