const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailWithAttachment = async (pdfBuffer, userEmail, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    bcc: process.env.EMAIL_BCC,
    subject: "Your Quotation PDF",
    html: `Dear ${name}, <br/> Please find attached the quotation. <br/><br/> Regards, <br/> Habi Team`,
    attachments: [
      {
        filename: "Quotation.pdf",
        content: Buffer.from(pdfBuffer),
        contentType: "application/pdf",
      },
    ],
  };

  console.time("Send email");
  transporter.sendMail(mailOptions);
  console.timeEnd("Send email");
};

module.exports = { sendEmailWithAttachment };
