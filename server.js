const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = 3000;

// 使用 cors 中间件，允许跨域请求
app.use(cors());

// 使用 body-parser 解析请求体中的 JSON 数据
app.use(bodyParser.json());

// 创建 Nodemailer 邮件发送器
const transporter = nodemailer.createTransport({
  service: "gmail", // 这里使用 Gmail 服务
  auth: {
    user: process.env.EMAIL_USER, // 从环境变量中读取邮箱地址
    pass: process.env.EMAIL_PASS, // 从环境变量中读取邮箱密码
  },
});

// 定义接收表单数据的接口
app.post("/api/submit", (req, res) => {
  console.log(req.body); // 打印请求体内容
  const { user, message } = req.body; // 获取表单数据
  const emailContent = `
    姓名: ${user.name}
    邮箱: ${user.email}
    消息: ${user.message}
  `;

  // 配置邮件内容
  const mailOptions = {
    from: process.env.EMAIL_USER, // 发件人地址
    to: process.env.EMAIL_USER, // 收件人地址（可以是你的邮箱或其他）
    subject: "表单提交数据", // 邮件主题
    text: emailContent, // 邮件内容
  };

  // 发送邮件
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send({ success: false, message: "邮件发送失败" });
    } else {
      console.log("邮件发送成功: " + info.response);
      res.status(200).send({ success: true, message: "邮件发送成功" });
    }
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器正在监听 http://localhost:${port}`);
});
