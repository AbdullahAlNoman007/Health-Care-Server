import nodemailer from "nodemailer"
import config from "../config";

const sendEmail = async (email: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: config.forgetPassword.email,
            pass: config.forgetPassword.email_pass,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const info = await transporter.sendMail({
        from: `"Health Care" <${config.forgetPassword.email}>`,
        to: email,
        subject: "Reset Password Link",
        html: html
    });
    //console.log("Message sent: %s", info.messageId);
}
export default sendEmail