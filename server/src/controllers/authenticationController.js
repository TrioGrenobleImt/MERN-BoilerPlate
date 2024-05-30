import User from '../models/UserModel.js'
import bcrypt from 'bcrypt'
import { generateAccessToken } from '../utils/generateAccessToken.js'
import mongoose from 'mongoose'

const register = async (req, res) => {
  const { email, username, password } = req.body
  if (!username || !email || !password) {
    return res.status(404).json({ error: 'Missing fields' })
  }

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'This email is already taken' })
    } else if (await User.findOne({ username })) {
      return res.status(400).json({ error: 'This username is already taken' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ email: email, username: username, password: hashedPassword })
    const accessToken = generateAccessToken(user._id)

    res.cookie('__access__token', accessToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    })

    res.status(200).json({ user: user, message: 'Registered succesfully' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

const login = async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(404).json({ error: 'Missing fields' })
  }

  try {
    const user = await User.findOne({ username }).select('+password')

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = generateAccessToken(user._id)

      res.cookie('__access__token', accessToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })

      const { password, ...userWithoutPassword } = user._doc

      res.status(200).json({ user: userWithoutPassword, message: 'Logged in succesfully' })
    } else {
      res.status(400).json({ error: 'Invalid credentials' })
    }
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

const logout = async (req, res) => {
  try {
    res.clearCookie('__access__token')
    res.status(200).json({ message: 'Signed out succesfully' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

const getConnectedUser = async (req, res) => {
  const id = req.userId

  if (!id) return res.status(401).json({ message: 'Not Authenticated' })

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'The ID user is invalid' })
  }

  try {
    const user = await User.findOne({ _id: id })

    if (!user) {
      return res.status(400).json({ error: 'No such user' })
    }

    res.status(200).json(user)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

const checkAuth = async (req, res) => {
  if (req.cookies.__access__token) {
    res.json({ authenticated: true })
  } else {
    res.json({ authenticated: false })
  }
}

export { login, register, logout, getConnectedUser, checkAuth }
