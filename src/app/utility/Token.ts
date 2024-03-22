import jwt, { JwtPayload } from 'jsonwebtoken'

const token = (payload: JwtPayload, privateKey: string, expiresTime: string) => {
    const createdToken = jwt.sign(payload, privateKey, { algorithm: 'HS256', expiresIn: expiresTime })
    return createdToken
}
export default token