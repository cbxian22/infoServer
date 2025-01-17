import express from "express";
import { createTransport } from "nodemailer";
import { config } from "dotenv";
import cors from "cors";
config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "https://info-vue.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use(express.json());

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/api/submit", (req, res) => {
  const { user, message } = req.body;
  const emailContent = `
    name: ${user.name}
    email: ${user.email}
    message: ${user.message}
  `;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "You received a message from InfoWeb.",
    text: emailContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send({ success: false, message: "Mail failed to send." });
    } else {
      console.log("Mail sent successfully: " + info.response);
      res
        .status(200)
        .send({ success: true, message: "Mail sent successfully." });
    }
  });
});

app.listen(port, () => {
  console.log(`伺服器正在 http://localhost:${port} 運行`);
});
