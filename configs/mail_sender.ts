import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL_NAME  ,
        pass: process.env.ADMIN_EMAIL_PASSWORD
    }
});

export default transporter