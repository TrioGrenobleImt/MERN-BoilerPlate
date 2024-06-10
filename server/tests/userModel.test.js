import mongoose from 'mongoose'
import { describe, it, beforeAll, afterAll, expect, afterEach, vitest, beforeEach } from 'vitest'
import 'dotenv/config'
import User from '../src/models/UserModel.js'
import bcrypt from 'bcrypt'

beforeAll(async () => {
  //Connect to database
  await mongoose.connect(process.env.MONG_URI_TEST)
})

afterAll(async () => {
  //Disconnect from database
  await mongoose.disconnect()
})

describe('user pre hooks', () => {
  afterEach(async () => {
    await User.deleteMany()
  })

  it('should hash the password before saving the user', async () => {
    const user = new User({ username: 'testuser', email: 'test@gmail.com', password: 'plainpassword' })

    await user.save()

    const savedUser = await User.findOne({ username: 'testuser' }).select('+password')
    expect(savedUser).toBeDefined()
    expect(savedUser.password).not.toBe('plainpassword')

    const isMatch = await bcrypt.compare('plainpassword', savedUser.password)
    expect(isMatch).toBe(true)
  })

  it('should not hash the password again if it is not modified', async () => {
    const user = new User({ username: 'testuser2', email: 'test@gmail.com', password: 'plainpassword' })

    await user.save()
    const firstHashedPassword = user.password

    user.username = 'updatedusername'
    await user.save()

    expect(user.password).toBe(firstHashedPassword)
  })
})
