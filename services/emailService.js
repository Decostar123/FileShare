const nodemailer = require("nodemailer");
//  THIS FUNCTION WILL BE CALLED TO SEND THE EMAIL
async function sendMail({ from, to, subject, text, html }) {
  // if we give html than text ignore
  // inside email html can also come to design the template
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    // if secure : true port will be 465
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  //   this sendMail is nodeMailer's method and the outer one is my personal method
  let info = await transporter.sendMail({
    from: `EasyShare<${from}>`,
    to,
    subject,
    text,
    html,
  });
}

module.exports = sendMail;
