import jwt from 'jsonwebtoken'

/**
 * 
 * @param {*} req -> request 
 * @param {*} res -> response 
 * @param {*} next -> Allows the request to move forward
 * 
  This function verifies the token that is sent in the request header. 
  If the token is valid, it will call the next middleware function. 
  If the token is invalid, it will return a 401 status code.
 */
const verifyToken = async (req, res, next) => {
  const token = req.cookies['__access__token']

  if (!token) return res.status(401).json({ message: 'Not Authenticated' })

  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, payload) => {
    if (err) return res.status(403).json({ message: 'Access Token is invalid' })
    req.userId = payload.id

    next()
  })
}

export default verifyToken
