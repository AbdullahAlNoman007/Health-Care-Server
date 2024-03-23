import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    salt_round: process.env.BCRYPT_SALT_ROUND,
    jwt_access_token: process.env.JWT_ACCESS_TOKEN,
    jwt_refresh_token: process.env.JWT_REFRESH_TOKEN,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    reset_pass_link: process.env.RESET_PASS_LINK,
    email: process.env.EMAIL,
    email_pass: process.env.EMAIL_PASS_KEY
}