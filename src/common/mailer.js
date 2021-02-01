import nodemailer from "nodemailer";

function sendEmail(message) {
  return new Promise((res, rej) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    transporter.sendMail(message, function (err, info) {
      if (err) {
        rej(err);
      } else {
        res(info);
      }
    });
  });
}

const sendOrderMail = ({ toUser }) => {
  const message = {
    from: process.env.SMTP_USER,
    to: toUser,
    subject: "Your App - Activate Account",
    html: `
        <h3> Hello </h3>
        <p>Thank you for registering into our Application. Much Appreciated! Just one last step is laying ahead of you...</p>
        <p>To activate your account please follow this link: <a target="_" href="${process.env.NEXTAUTH_URL}/api/activate/user/${hash}">${process.env.DOMAIN}/activate </a></p>
        <p>Cheers</p>
        <p>Your Application Team</p>
      `,
  };

  sendEmail(message);
};

export default sendOrderMail;
