export default {
  email: {
    config: {
      provider: "sendgrid",
      providerOptions: {
        apiKey: process.env.SENDGRID_API_KEY,
      },
      settings: {
        defaultFrom: "skillzncert@yopmail.com",
        defaultReplyTo: "skillzncert@yopmail.com",
      },
    },
  },
};

