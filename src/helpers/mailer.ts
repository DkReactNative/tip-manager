import * as fs from "fs"
import ejs from "ejs"
import nodemailer from "nodemailer"
import config from'../config';
const {emailOptions} = config
const mailSend = async function(data) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailOptions.email,
                pass: emailOptions.password
            }
        });
        let email_content , email_template_path = __dirname + "/../constants/welcome-mail.ejs";
        try {
        email_content =  await ejs.renderFile(email_template_path,{name: data.name})
        } catch(err){
            email_content = `Welcome ${data.name} to Tip manager`
        }
            var mailOptions = {
                from: emailOptions.name + emailOptions.email,
                to: data.email,
                subject: data.subject,
                html: email_content
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                    return false
                } else {
                    console.log('Email sent: ' + info.response);
                    return true
                }
            });
        };
    /* Node Mailer Work End */

export default mailSend