require('dotenv').config(); 
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;


const OAuth2 = google.auth.OAuth2;
const OAuth2_client = new OAuth2(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET);
OAuth2_client.setCredentials( { refresh_token: process.env.GMAIL_REFRESH_TOKEN} );
const accessToken = OAuth2_client.getAccessToken();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: accessToken,
  },
  tls: { rejectUnauthorized: false }
})

app.post('/send', (req, res) => {

    const subject = req.body.subject || 'No subject';
    const content = req.body.content;
    const recipient = req.body.recipient;


    const mailNewOrder = {
        from: `Email Sender <${process.env.GMAIL_USER}>`,
        to: recipient,
        subject: subject,
        html: content,
    };
    
    
    transporter.sendMail(mailNewOrder, (error, info) => {
        if(error) {
            res.send(error);
        } else {
            res.send(info);
        }
    });
});



app.listen(PORT, () => console.log(`Listenning on port ${PORT}`));