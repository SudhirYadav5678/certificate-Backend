import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config({
    path: './.env'
})


const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465, // gamil port
    secure: true,
    auth: {
        user: process.env.GMAIL,  //sender
        pass: process.env.PASSWORD,
    },
});


export const sendMail = async function (to, subject, text, html) {
    try {
        console.log(to, subject, text, html);

        const info = await transporter.sendMail({
            from: '"QuickUp👻" <sudhirpubg66@gmail.com>', // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.log("Error in email send", error);
    }
}