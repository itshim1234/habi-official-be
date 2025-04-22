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
    html: `
      <div
        style="justify-content: center; max-width: 450px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); font-family: 'Poppins', Arial, sans-serif;">

        <!-- Top Section with Centered Logo -->
        <div style="justify-content: center; background: url('https://i.ibb.co/xqgZFt31/aaa.png') no-repeat center center; align-items: center; height: 108px; background-color: #ffffff; border-bottom: 1px dashed #7c7c7c;">
            <img src="https://i.ibb.co/8gMCjJYc/Logo.png" alt="Habi Logo"
                style="max-width: 180px; height: 60px; padding-top: 20px; padding-left:100px; justify-content: center; align-items: center;">
        </div>

        <!-- Content Section -->
        <div
            style="position: relative; background: url('https://i.ibb.co/sd5KvcQg/bg.png') no-repeat center center; padding-top: 0px; margin-top: 0px; padding-left: 35px; padding-right: 35px; text-align: center; color: #333333; height: 457px;">
            <h2 style="font-size: 18px; color: #7c7c7c; padding-top: 40px; margin-top: 0px;">Dear ${name},</h2>
            <p style="font-size: 14px; padding-top: 8px; color: #7c7c7c;">
                Thank you for reaching out. <br> Please find attached the quotation as per your request.
            </p>
            <p style="font-size: 12px; font-style: italic; color: #7c7c7c; padding-top: 30px;">
                If you have any questions or need further clarifications, feel free to reply to this email.
            </p>
            <p style="position: relative; font-size: 16px; font-weight: bold; color: #0FB4C3; padding-top: 8px;">
                Looking forward to your response
                <img src="https://i.ibb.co/xq0cSX01/star.png" style="position: absolute; top: 0;" alt="">
                <img src="https://i.ibb.co/xq0cSX01/star.png" style="position: absolute; top: -5px; right: 30px; width: 10px; opacity: 0.5;" alt="">
            </p>

            <p style="font-size: 14px; padding-top: 20px; font-weight: bold; color: #7c7c7c;">Best regards,</p>
            <p style="font-size: 14px; margin-top: 0.2em; color: #7c7c7c;">habi homes</p>
            <p style="font-size: 14px; margin-top: 0.2em; color: #7c7c7c;">9606210818</p>
            <p style="font-size: 14px; margin-top: 0.2em; color: #7c7c7c;"><a href="mailto:hello@habi.one" style="color: #7c7c7c; text-decoration: none;">hello@habi.one</a></p>

            <div style="text-align: center; padding-top: 25px;">
                <p style="font-size: 14px; color: #7c7c7c;">↓ Quotation here ↓</p>
            </div>
        </div>
    </div>
    `,
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
