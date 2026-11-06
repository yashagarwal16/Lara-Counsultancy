# AWS deployment

This app is a Next.js server application. It needs a Node.js server because it
uses API routes, MongoDB, authentication, email notifications, and the chatbot.
The included Dockerfile packages the app for AWS App Runner or ECS/Fargate.

## Recommended path: AWS App Runner from an ECR image

1. Create an Amazon ECR private repository, for example `lara-consultancy`.
2. Build and push the image from a machine with Docker and AWS credentials:

   ```powershell
   aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
   docker build -t lara-consultancy .
   docker tag lara-consultancy:latest <account>.dkr.ecr.<region>.amazonaws.com/lara-consultancy:latest
   docker push <account>.dkr.ecr.<region>.amazonaws.com/lara-consultancy:latest
   ```

3. In AWS App Runner, create a service from the ECR image.
   Use port `3000`, and set the health check path to `/`.
4. Add the variables listed in `.env.example` under App Runner environment
   variables and secrets. Do not upload `.env.local` or commit any secret.
5. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS App Runner URL (or custom
   domain), then redeploy so metadata and the sitemap use the public URL.

## Required production variables

`MONGODB_URI`, `CONTACT_RECIPIENT_1`, `MAIL_FROM`, `SMTP_HOST`, `SMTP_PORT`,
`SMTP_USER`, `SMTP_PASSWORD`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and
`ADMIN_SESSION_SECRET` are required for the core site and dashboard.

`GEMINI_API_KEY` enables the chatbot. The `TWILIO_*` variables are optional and
enable WhatsApp notifications.

## Notes

- Allow the App Runner outbound IP range in MongoDB Atlas, or configure Atlas
  network access appropriately for the deployment.
- Use Node.js 22 or newer in the build environment.
- AWS Amplify Hosting's current managed Next.js SSR documentation supports up
  through Next.js 15; this project uses Next.js 16, so the container path avoids
  that version mismatch.
