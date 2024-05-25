import jwt from 'jsonwebtoken'

const verifyToken = async (req, res, next) => {
  const token = req.cookies['__access__token']

  if (!token) return res.status(401).json({ message: 'Not Authenticated' })

  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, payload) => {
    if (err) return res.status(401).json({ message: 'Access Token is invalid' })
    req.userId = payload.id

    next()
  })
}

export default verifyToken
