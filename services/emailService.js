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
<body style="margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
        background="https://res.cloudinary.com/dlvsecyqm/image/upload/v1746792998/bg_bqpa4f.png"
        style="background-size: cover; background-repeat: no-repeat; background-position: center center;">
        <tr>
            <td align="center" style="padding: 40px 10px;">
                <!-- Actual content card -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="max-width: 450px; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); font-family: 'Poppins', Arial, sans-serif;">

                    <!-- Logo -->
                    <tr>
                        <td align="center" style="padding: 20px 0; border-bottom: 1px dashed #cccccc;">
                            <img src="https://res.cloudinary.com/dlvsecyqm/image/upload/v1746792397/Logo_ilvb2u.png"
                                alt="Habi Logo" style="max-width: 160px;" />
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px 20px; text-align: center; color: #333333;">
                            <h2 style="font-size: 18px; color: #7c7c7c; padding-top: 40px; margin-top: 0px;">Dear
                                ${name},</h2>
                            <p style="font-size: 14px; color: #555555; line-height: 1.5; margin: 15px 0;">
                                Thank you for reaching out.<br />Please find attached the quotation as per your request.
                            </p>
                            <p style="font-size: 13px; font-style: italic;  color: #777777; margin: 20px 0;">
                                If you have any questions or need further clarifications, feel free to reply to this
                                email.
                            </p>
                          <p style="font-size: 15px; font-weight: bold; color: #0FB4C3; margin-top: 20px; text-align: center;">
  Looking forward to your response
</p>
<table align="center" cellpadding="0" cellspacing="0" style="margin: 5px auto;">
  <tr>
    <td style="padding-right: 5px;">
      <img src="https://res.cloudinary.com/dlvsecyqm/image/upload/v1746792482/star_lrcsni.png" width="14" alt="*" />
    </td>
    <td>
      <img src="https://res.cloudinary.com/dlvsecyqm/image/upload/v1746792482/star_lrcsni.png" width="10" style="opacity: 0.5;" alt="*" />
    </td>
  </tr>
</table>

                            <p style="font-size: 14px; padding-top: 20px; font-weight: bold; color: #7c7c7c;">Best
                                regards,</p>
                            <p style="font-size: 14px; margin-top: 0.2em; color: #7c7c7c;">habi homes</p>
                            <p style="font-size: 14px; margin-top: 0.2em; color: #7c7c7c;">9606210818</p>
                            <p style="font-size: 14px; margin-top: 0.2em; color: #7c7c7c;"><a
                                    href="mailto:hello@habi.one"
                                    style="color: #7c7c7c; text-decoration: none;">hello@habi.one</a></p>
                            <!-- Signature -->


                            <!-- Footer -->
                            <div style="padding-top: 25px;">
                                <p style="font-size: 14px; color: #888888;">↓ Quotation here ↓</p>
                            </div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

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
