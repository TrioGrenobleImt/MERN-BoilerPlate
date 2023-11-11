import User from '../models/UserModel.js'
import mongoose from 'mongoose'

//Get a single user
const getUser = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'The ID user is invalid' })
  }
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(400).json({ error: 'No such user' })
    }
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

//Get all the users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 })
    res.status(200).json(users)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Create a user
const createUser = async (req, res) => {
  const { email, username, password } = req.body
  if (!email || !username || !password) {
    return res.status(404).json({ error: 'Missing fields' })
  }
  try {
    const user = await User.create({ email, username, password })
    res.status(200).json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

//Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'The ID user is invalid' })
  }
  try {
    const user = await User.findOneAndDelete({ _id: id })
    if (!user) {
      return res.status(400).json({ error: 'No such user' })
    }
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

//Update a user
const updateUser = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'The ID user is invalid' })
  }
  try {
    const user = await User.findOneAndUpdate({ _id: id }, { ...req.body })
    if (!user) {
      return res.status(400).json({ error: 'No such user' })
    }
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
}
