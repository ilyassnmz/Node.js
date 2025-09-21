// smtp-test.js (proje kökünde)
const nodemailer = require("nodemailer");
const config = require("./config"); // config dosyanın yolunu kontrol et

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com", // veya "smtp-mail.outlook.com"
  port: 587,
  secure: false,
  auth: {
    user: config.email.username,
    pass: config.email.password
  },
  logger: true,      // detaylı log
  debug: true,       // detaylı debug
  tls: {
    rejectUnauthorized: false
  }
});

async function verifyAndSend() {
  try {
    console.log("Kullanılan credentials:", {
      user: config.email.username,
      passLength: config.email.password ? config.email.password.length : 0
    });

    // transporter doğrulama
    await transporter.verify();
    console.log("SMTP bağlantısı doğrulandı — kimlik doğrulama başarılı.");

    // küçük test maili
    const info = await transporter.sendMail({
      from: config.email.from,
      to: config.email.username, // kendine at test için
      subject: "SMTP Test",
      text: "Bu bir testtir."
    });

    console.log("Mail gönderildi:", info.messageId);
  } catch (err) {
    console.error("Hata detayları:", err);
  }
}

verifyAndSend();
