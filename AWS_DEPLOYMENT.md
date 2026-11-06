# AWS deployment

This app is a Next.js server application. It needs a Node.js server because it
uses API routes, MongoDB, authentication, email notifications, and the chatbot.
The primary deployment target is AWS Amplify Hosting. The repository includes
`amplify.yml` with the required Node.js 22 build and `.next` artifact settings.

## Recommended path: AWS Amplify Hosting

1. Connect the Git repository in Amplify Hosting and select the branch to deploy.
2. Use the build settings committed in `amplify.yml`.
3. In Amplify environment variables, add the variables listed in `.env.example`.
   Keep credentials in Amplify secrets/environment variables; do not upload
   `.env.local` or commit any secret.
4. Set `NEXT_PUBLIC_SITE_URL` to the final Amplify HTTPS URL (or custom domain)
   before the build. This is required because metadata, sitemap, and robots are
   generated during the build.
5. The committed `amplify.yml` copies the configured server variables into
   `.env.production` before the Next.js build, which makes them available to
   Amplify's SSR runtime. Do not print this file in build logs.
6. Ensure the MongoDB Atlas network access configuration allows the Amplify
   server runtime to connect.

## Alternative path: App Runner or ECS/Fargate

The included `Dockerfile` remains available for container deployment. It uses
Next.js standalone output only when the container configuration enables it.

## Required production variables

`MONGODB_URI`, `CONTACT_RECIPIENT_1`, `MAIL_FROM`, `SMTP_HOST`, `SMTP_PORT`,
`SMTP_USER`, `SMTP_PASSWORD`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and
`ADMIN_SESSION_SECRET` are required for the core site and dashboard.

`GEMINI_API_KEY` enables the chatbot. The `TWILIO_*` variables are optional and
enable WhatsApp notifications.

## Notes

- Allow the Amplify server runtime to reach MongoDB Atlas, or configure Atlas
  network access appropriately for the deployment.
- Use Node.js 22 or newer in the build environment.
- Amplify Hosting's managed Next.js SSR support is aligned with the Next.js 15
  release line used by this project.
