// export default ({ env }) => ({
//   // SendGrid Email Configuration (Paid service)
//   // email: {
//   //   config: {
//   //     provider: "sendgrid",
//   //     providerOptions: {
//   //       apiKey: env("SENDGRID_API_KEY"),
//   //     },
//   //     settings: {
//   //       defaultFrom: "skillzncert@yopmail.com",
//   //       defaultReplyTo: "skillzncert@yopmail.com",
//   //     },
//   //   },
//   // },

//   // Nodemailer with Gmail (Free - up to 500 emails/day)
//   email: {
//     config: {
//       provider: "nodemailer",
//       providerOptions: {
//         host: env("SMTP_HOST", "smtp.gmail.com"),
//         port: env("SMTP_PORT", 587),
//         auth: {
//           user: env("SMTP_USERNAME"), // Your Gmail address
//           pass: env("SMTP_PASSWORD"), // Your Gmail App Password (not regular password)
//         },
//       },
//       settings: {
//         defaultFrom: env("SMTP_USERNAME"), // Your Gmail address
//         defaultReplyTo: env("SMTP_USERNAME"),
//       },
//     },
//   },
//   // upload: {
//   //   config: {
//   //     provider: "strapi-provider-upload-supabase",
//   //     providerOptions: {
//   //       apiUrl: env("SUPABASE_API_URL"), // Supabase API URL
//   //       apiKey: env("SUPABASE_API_KEY"), // Supabase API key (Your anon/public key)
//   //       bucket: env("SUPABASE_BUCKET"), // The name of the Supabase bucket (e.g., 'strapi-bucket')
//   //     },
//   //   },
//   // },
// });

export default ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST", "smtp.gmail.com"),
        port: env.int("SMTP_PORT", 587),
        secure: false, // true for port 465, false for 587
        auth: {
          user: env("SMTP_USERNAME"),
          pass: env("SMTP_PASSWORD"),
        },
      },
      settings: {
        defaultFrom: env("SMTP_USERNAME"),
        defaultReplyTo: env("SMTP_USERNAME"),
      },
    },
  },
});
