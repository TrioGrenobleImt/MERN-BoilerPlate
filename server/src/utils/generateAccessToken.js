import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '30d' })
}
