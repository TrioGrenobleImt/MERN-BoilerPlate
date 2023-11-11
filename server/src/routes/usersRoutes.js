import express from 'express'
import userController from '../controllers/userController.js'

const router = express.Router()

//GET all users
router.get('/list', userController.getUsers)

//Get a single user
router.get('/:id', userController.getUser)

//Create a new user
router.post('/new', userController.createUser)

//Delete a user
router.delete('/:id', userController.deleteUser)

//Update a user
router.put('/:id', userController.updateUser)

export default router
