import express from 'express'
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/userController.js'

const router = express.Router()

//GET all users
router.get('/list', getUsers)

//Get a single user
router.get('/:id', getUser)

//Create a new user
router.post('/new', createUser)

//Update a user
router.put('/:id', updateUser)

//Delete a user
router.delete('/:id', deleteUser)

export default router
