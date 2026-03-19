import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async ({
  to,
  subject,
  html,
}: MailOptions): Promise<void> => {
  await resend.emails.send({
    from: "Playce <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
};
