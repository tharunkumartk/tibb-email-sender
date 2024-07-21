const nodemailer = require("nodemailer");
const express = require("express");
const realm = require("realm");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

const confirmUser = async (token, tokenId) => {
  try {
    const app = realm.App.getApp("data-jrnnm");
    console.log("confirming user...");
    await app.emailPasswordAuth.confirmUser({
      token,
      tokenId,
    });
    console.log("confirmed user!");
    return true;
  } catch (err) {
    console.error("Failed to confirm user: ", err);
    return false;
  }
};

const sendResetEmail = async (email, token, tokenId) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: "support@rescalemed.org",
      pass: "Go2TibbChat$*123",
    },
  });

  const url = `https://master--singular-unicorn-70bfab.netlify.app/reset-password?token=${token}&tokenId=${tokenId}`;

  const mailOptions = {
    from: "support@rescalemed.org",
    to: email,
    subject: "Password reset request",
    html: `<div style="text-align: center;"><div style="background-color: rgb(255, 255, 255); font-size: calc(10px + 1vmin); padding: 10%;"><img src="https://i.ibb.co/P94dP1Z/icon.png" alt="logo" style="height: 15vmin;"><p style="margin-bottom: 10vh; font-size: 0.8em;"> RescaleMed </p><h2> Let's reset your password.</h2><p>We'll keep you posted on the latest behavioral health tips, stored coaching updates and special offers.</p><a href="${url}" style="background-color: rgb(57, 96, 140); border-radius: 15px; padding: 10px 20px; cursor: pointer; font-size: calc(10px + 1vmin); color: rgb(255, 255, 255); text-decoration: none; margin-top: 10vh;">Reset Password</a></div><div style="background-color: rgb(242, 242, 242); min-height: 25vh; font-size: calc(10px + 2vmin); padding: 5vh 0px 0px; text-align: center;"><div style="display: flex; align-items: center; justify-content: center;"><a href="http://twitter.com/rescalemed" style="font-size: 0.75em; color: rgb(57, 96, 140); margin: 0px 10px;">Twitter</a><a href="https://rescalemed.com/privacy-policy" style="font-size: 0.75em; color: rgb(57, 96, 140); margin: 0px 10px;">Terms and Conditions</a><a href="https://rescalemed.com/" style="font-size: 0.75em; color: rgb(57, 96, 140); margin: 0px 10px;">Website</a></div><p style="font-size: 0.8em;">© 2023 RescaleMed. All rights reserved.</p></div></div>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return error;
    } else {
      return "Email sent: " + info.response;
    }
  });
};

const sendEmail = async (email, token, tokenId) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: "support@rescalemed.org",
      pass: "Go2TibbChat$*123",
    },
  });

  const url = `https://master--singular-unicorn-70bfab.netlify.app/?token=${token}&tokenId=${tokenId}`;

  const mailOptions = {
    from: "support@rescalemed.org",
    to: email,
    subject: "Tibb wants to confirm your email",
    html: `<div style="text-align: center;"><div style="background-color: rgb(255, 255, 255); font-size: calc(10px + 1vmin); padding: 10%;"><img src="https://i.ibb.co/P94dP1Z/icon.png" alt="logo" style="height: 15vmin;"><p style="margin-bottom: 10vh; font-size: 0.8em;"> RescaleMed </p><h2> Thanks for signing up.</h2><p>We'll keep you posted on the latest behavioral health tips, stored coaching updates and special offers.</p><a href="${url}" style="background-color: rgb(57, 96, 140); border-radius: 15px; padding: 10px 20px; cursor: pointer; font-size: calc(10px + 1vmin); color: rgb(255, 255, 255); text-decoration: none; margin-top: 10vh;">Confirm Email</a></div><div style="background-color: rgb(242, 242, 242); min-height: 25vh; font-size: calc(10px + 2vmin); padding: 5vh 0px 0px; text-align: center;"><div style="display: flex; align-items: center; justify-content: center;"><a href="http://twitter.com/rescalemed" style="font-size: 0.75em; color: rgb(57, 96, 140); margin: 0px 10px;">Twitter</a><a href="https://rescalemed.com/privacy-policy" style="font-size: 0.75em; color: rgb(57, 96, 140); margin: 0px 10px;">Terms and Conditions</a><a href="https://rescalemed.com/" style="font-size: 0.75em; color: rgb(57, 96, 140); margin: 0px 10px;">Website</a></div><p style="font-size: 0.8em;">© 2023 RescaleMed. All rights reserved.</p></div></div>`,
  };

  console.log(email, token, tokenId);
  console.log(typeof email, typeof token, typeof tokenId);

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return error;
    } else {
      return "Email sent: " + info.response;
    }
  });
};

app.use(express.json());

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

app.post("/confirm-token", authenticateUser, async (request, response) => {
  console.log(request.query);
  if (!request.query.token || !request.query.tokenId) {
    response.status(401).send("Invalid parameters");
    console.log("test");
  } else {
    confirmUser(request.query.token, request.query.tokenId).then((resp) => {
      const status = {
        response: resp,
      };
      console.log(resp);
      response.send(status);
    });
  }
});

app.post("/reset-email", authenticateUser, async (request, response) => {
  console.log(request.body);

  if (!request.body.email || !request.body.token || !request.body.tokenId) {
    response.status(401).send("Invalid parameters");
  } else {
    sendResetEmail(
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
