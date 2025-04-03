const authConfig = {
  providers: [
    // Uncomment this once you have set up a Clerk app
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
