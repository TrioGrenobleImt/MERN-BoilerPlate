import { Resend } from "resend";

export const sendEmail = async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(400).json({ message: "Missing Resend API key" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const data = await resend.emails.send({
      from: "MERN-Boilerplate <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: message,
    });
    return res.status(200).json({ message: "Email sent successfully", data });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Failed to send email", error });
  }
};
