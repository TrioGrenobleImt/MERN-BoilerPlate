import mongoose from 'mongoose'
import { describe, it, beforeAll, afterAll, expect, afterEach, vitest } from 'vitest'
import 'dotenv/config'
import request from 'supertest'
import jwt from 'jsonwebtoken'

//Import server and app
import { server, app } from '../server.js'

beforeAll(async () => {
  //Connect to database
  await mongoose.connect(process.env.MONG_URI_TEST)
})

afterAll(async () => {
  //Disconnect from database
  await mongoose.disconnect()
  server.close()
})

describe('verifyToken', () => {
  it('should return a 401 status error because the token is missing', async () => {
    const res = await request(app).get('/api/auth/me').send()

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Not Authenticated')
  })

  it('should return a 403 status error because the token is invalid', async () => {
    const res = await request(app).get('/api/auth/me').set('Cookie', '__access__token=invalidtoken').send()

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Access Token is invalid')
  })

  it('should call next middleware because the token is valid', async () => {
    const user = { id: 'userId123' }
    const token = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN)

    const res = await request(app).get('/api/auth/me').set('Cookie', `__access__token=${token}`).send()

    expect(res.status).toBe(404)
  })
})
