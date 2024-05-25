import express from 'express'
import 'dotenv/config'
import { connectToDatabase } from './src/database/connectToDB.js'
import UsersRoutes from './src/routes/usersRoutes.js'
import AuthenticationRoutes from './src/routes/authenticationRoutes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

//Configuration du cors
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: 'GET, POST, PUT, PATCH, DELETE',
  preflightContinue: true,
}

//express app
const app = express()

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})
app.use(cors(corsOptions))
app.use(cookieParser())

//routes
app.use('/api/users', UsersRoutes)
app.use('/api/auth', AuthenticationRoutes)

//listen for requests
app.listen(process.env.PORT, () => {
  console.log('Server listening on port', process.env.PORT, '🚀')
  //connect to database
  connectToDatabase()
})
