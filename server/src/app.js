import express from "express";

import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import { corsOptions } from "./configuration/corsOptions.js";
import { router } from "./routes/router.js";

import { Resend } from "resend";

//express app
export const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
app.use(cors(corsOptions));
app.use(cookieParser());

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  console.error("Missing RESEND_API_KEY environment variable");
  process.exit(1);
}

app.get("/email", async (req, res) => {
  const { data, error } = await resend.emails.send({
    from: "MERN-Boilerplate <no-reply-MERN-Boilerplate@resend.dev>",
    to: ["teo.villet2@gmail.com"],
    subject: "hello world",
    html: "<strong>it works!</strong>",
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ message: "Email sent successfully" });
});

// Routes
app.use(router);
