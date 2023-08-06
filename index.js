const genAPIKey = () => {
  //create a base-36 string that contains 30 chars in a-z,0-9
  return [...Array(30)]
    .map((e) => ((Math.random() * 36) | 0).toString(36))
    .join("");
};

const sendEmail = async (email, token, tokenId) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: "support@rescalemed.org",
      pass: "UnicornBot123",
    },
  });

  const url = `https://master--singular-unicorn-70bfab.netlify.app/?token=${token}&tokenId=${tokenId}`;

  const mailOptions = {
    from: "support@rescalemed.org",
    to: email,
    subject: "Tibb wants to confirm your email",
    html: `<div style="text-align: center;"><div style="background-color: rgb(255, 255, 255); font-size: calc(10px + 1vmin); padding: 10%;"><img src="https://i.ibb.co/P94dP1Z/icon.png" alt="logo" style="height: 15vmin;"><p style="margin-bottom: 10vh; font-size: 0.8em;"> RescaleMed </p><h2> Thanks for signing up.</h2><p>We'll keep you posted on the latest behavioral health tips, stored coaching updates and special offers.</p><a href="${url}" style="background-color: rgb(57, 96, 140); border-radius: 15px; padding: 10px 20px; cursor: pointer; font-size: calc(10px + 1vmin); color: rgb(255, 255, 255); text-decoration: none; margin-top: 10vh;">Confirm Email</a></div><div style="background-color: rgb(242, 242, 242); min-height: 25vh; font-size: calc(10px + 2vmin); padding: 5vh 0px 0px; text-align: center;"><div style="display: flex; align-items: center; justify-content: center;"><a href="http://twitter.com/rescalemed" style="font-size: 0.75em; color: rgb(57, 96, 140); margin: 0px 10px;">Twitter</a><a href="https://rescalemed.com/privacy-policy" style="font-size: 0.75em; color: rgb(57, 96, 140); margin: 0px 10px;">Terms and Conditions</a><a href="https://rescalemed.com/" style="font-size: 0.75em; color: rgb(57, 96, 140); margin: 0px 10px;">Website</a></div><p style="font-size: 0.8em;">© 2023 RescaleMed. All rights reserved.</p></div></div>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return error;
    } else {
      return "Email sent: " + info.response;
    }
  });
};

const nodemailer = require("nodemailer");
const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const apiKeys = ["miz6uonzzgxhrk60xoa3qzrlnsgal4"];

const authenticateUser = (request, response, next) => {
  let api_key = request.header("api-key");
  // check api key
  let authenticated = false;
  for (let i = 0; i < apiKeys.length; i++) {
    if (apiKeys[i] === api_key) {
      authenticated = true;
      break;
    }
  }
  if (!authenticated) {
    response.status(401).send("Unauthorized");
  }
  next();
};

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

app.post("/confirm-email", authenticateUser, async (request, response) => {
  console.log(request.body);

  if (!request.body.email || !request.body.token || !request.body.tokenId) {
    response.status(401).send("Invalid parameters");
  } else {
    sendEmail(
      request.body.email,
      request.body.token,
      request.body.tokenId
    ).then((resp) => {
      const status = {
        response: resp,
      };
      console.log(resp);
      response.send(status);
    });
  }
});
