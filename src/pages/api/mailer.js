import nodemailer from "nodemailer";
import { google } from "googleapis";

export default async function handler(req, res) {
  const { OAuth2 } = google.auth;
  const { email, subject } = req.body;
  console.log(email, subject);

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
          from: SENDER_EMAIL_ADDRESS,
          to: email,
          subject: subject,
          text: "",
          html: `<!doctype html>
          <html ⚡4email>
            <head>
              <meta charset="utf-8">
              <style amp4email-boilerplate>body{visibility:hidden}</style>
              <script async src="https://cdn.ampproject.org/v0.js"></script>
              <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
            </head>
            <body>
              <p>Image: <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
              <p>GIF (requires "amp-anim" script in header):<br/>
                <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
            </body>
          </html>`,
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
            res.json({ message: "email failed !", error: err });
            res.end();
          } else {
            res.json({ message: "email sent successfully", info: info });
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
