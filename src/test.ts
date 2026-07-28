import { transporter } from "./utils/mail.js";

await transporter.verify();

console.log("SMTP Connected");