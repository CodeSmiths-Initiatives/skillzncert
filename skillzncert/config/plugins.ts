export default ({ env }) => ({
  email: {
    config: {
      provider: "sendgrid",
      providerOptions: {
        apiKey: env("SENDGRID_API_KEY"), // Make sure to set this in your .env file
      },
      settings: {
        defaultFrom: "skillzncert@yopmail.com", // Set default sender email
        defaultReplyTo: "skillzncert@yopmail.com", // Set default reply-to email
      },
    },
  },
  // upload: {
  //   config: {
  //     provider: "strapi-provider-upload-supabase",
  //     providerOptions: {
  //       apiUrl: env("SUPABASE_API_URL"), // Supabase API URL
  //       apiKey: env("SUPABASE_API_KEY"), // Supabase API key (Your anon/public key)
  //       bucket: env("SUPABASE_BUCKET"), // The name of the Supabase bucket (e.g., 'strapi-bucket')
  //     },
  //   },
  // },
});
