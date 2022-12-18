const nodemailer = require('nodemailer');
const senderInfo = require('../config/senderInfo.json');
const mailTemplate = require('../views/mail_template').mailTemplate;

const getEmailData = (to, authCode) => {
    let data = {
        from: senderInfo.user,
        to,
        subject: " ** 기자재 대여 본인인증 이메일입니다. ** ",
        html: mailTemplate(authCode)
    }

    return data
}

const sendEmail = (to, authCode) => {
    return new Promise((resolve) => {


        const smtpTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: senderInfo.user,
                pass: senderInfo.pass
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mail = getEmailData(to, authCode)

        smtpTransport.sendMail(mail, function (error, res) {
            if (error) {
                console.log(error);
                
                resolve(false);
            } else {
                console.log("email sent successfully");
                
                resolve(true);
            }

            smtpTransport.close();

        })
    })
}


module.exports = { sendEmail }