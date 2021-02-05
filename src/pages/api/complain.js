import nodemailer from "nodemailer";
import { google } from "googleapis";

export default async function handler(req, res) {
  const { OAuth2 } = google.auth;
  const { from, subject, message } = req.body;
  console.log(req.body);

  const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
  const {
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS,
  } = process.env;

  const oauth2Client = new OAuth2(
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    OAUTH_PLAYGROUND
  );

  switch (req.method) {
    case "GET":
      //...
      break;
    case "POST":
      try {
        oauth2Client.setCredentials({
          refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
        });
        const accessToken = oauth2Client.getAccessToken();

        const mailOptions = {
          from: from,
          to: SENDER_EMAIL_ADDRESS,
          subject: "Stora Contact " + subject,
          text: message,
        };

        const smtpTransport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: SENDER_EMAIL_ADDRESS,
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret: MAILING_SERVICE_CLIENT_SECRET,
            refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
            accessToken,
          },
        });

        smtpTransport.sendMail(mailOptions, (err, info) => {
          if (err) {
            res.json({ message: "failed", error: err });
            res.end();
          } else {
            res.json({ message: "success", info: info });
            res.end();
          }
        });
      } catch (error) {
        res.status(500).json(error);
      }
      break;
    default:
      res.status(405).end();
      break;
  }
}
