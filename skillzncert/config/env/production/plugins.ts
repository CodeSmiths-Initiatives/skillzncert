export default ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST", "smtp.gmail.com"),
        port: env.int("SMTP_PORT", 465),
        secure: env.bool("SMTP_SECURE", true),
        auth: {
          user: env("SMTP_USERNAME"),
          pass: env("SMTP_PASSWORD"),
        },
      },
      settings: {
        defaultFrom: env("SMTP_FROM", env("SMTP_USERNAME")),
        defaultReplyTo: env("SMTP_REPLY_TO", env("SMTP_USERNAME")),
      },
    },
  },
});
