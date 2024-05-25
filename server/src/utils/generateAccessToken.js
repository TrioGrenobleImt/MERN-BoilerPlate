import jwt from 'jsonwebtoken'

export const generateAccessToken = (req, res) => {
  return jwt.sign({ id: req.body }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '30d' })
}
