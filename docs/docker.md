# Docker Deployment Guide for Dagboks-appen

Complete guide for deploying your Next.js app to Render using Docker with Supabase Edge Functions.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start (5 Minutes)](#quick-start-5-minutes)
- [Understanding the Setup](#understanding-the-setup)
- [Detailed Deployment Steps](#detailed-deployment-steps)
- [Updating Your Deployment](#updating-your-deployment)
- [Troubleshooting](#troubleshooting)
- [Docker Commands Reference](#docker-commands-reference)

---

## Prerequisites

Before you begin, make sure you have:

- **Docker Desktop** installed and running on your machine ([Download here](https://www.docker.com/products/docker-desktop))
- **Docker Hub account** (free at [hub.docker.com](https://hub.docker.com))
- **Render account** (free at [render.com](https://render.com))
- **Supabase project** with your URL and anon key ([supabase.com](https://supabase.com))

---

## Quick Start (5 Minutes)

### Step 1: Configure Environment Variables

Create your local environment file with your credentials:

```bash
# Copy the template
cp .env.docker.example .env.local

# Edit the file (use nano, vim, or VS Code)
nano .env.local
```

Add your credentials to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
DOCKER_USERNAME=your-dockerhub-username
```

### Step 2: Build the Docker Image

```bash
# Make scripts executable (first time only)
chmod +x docker-build.sh docker-push.sh

# Build the image
./docker-build.sh
```

The build script will:

- Read your Supabase credentials from `.env.local`
- Build a Docker image with Next.js in **standalone mode** (~100-200MB)
- Tag it as `dagboks-appen`

### Step 3: Test Locally

```bash
docker run -p 3000:3000 dagboks-appen
```

Open your browser to **http://localhost:3000** and verify everything works.

Press `Ctrl+C` to stop the container.

### Step 4: Push to Docker Hub

```bash
./docker-push.sh
```

The script will:

1. Prompt for your Docker Hub username (or read from `.env.local`)
2. Ask you to login to Docker Hub
3. Tag and push your image to Docker Hub

Your image will be available at: `your-username/dagboks-appen:latest`

### Step 5: Deploy to Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Choose **"Deploy an existing image from a registry"**
4. Enter image URL: `your-username/dagboks-appen:latest`
5. Configure:
   - **Name**: `dagboks-appen` (or your preference)
   - **Region**: Choose closest to your users
   - **Instance Type**: Free or Starter
6. Add **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
7. Click **"Create Web Service"**

🎉 **Done!** Render will pull your image and deploy your app.

---

## Understanding the Setup

### Docker Standalone Mode

This project uses Next.js **standalone mode**, which creates optimized Docker images:

| Feature      | Traditional Build | Standalone Build  |
| ------------ | ----------------- | ----------------- |
| Image Size   | ~500MB - 1GB      | ~100-200MB        |
| Startup      | `npm start`       | `node server.js`  |
| Dependencies | All node_modules  | Only used modules |
| Best For     | Development       | Production/Docker |

Standalone mode traces which files are actually imported and bundles only those, resulting in much smaller images.

### Environment Variables

| Variable                        | Where Used       | Purpose                     |
| ------------------------------- | ---------------- | --------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Build & Runtime  | Your Supabase project URL   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Build & Runtime  | Supabase authentication key |
| `DOCKER_USERNAME`               | Push script only | Your Docker Hub username    |

**Important**: Variables prefixed with `NEXT_PUBLIC_` are embedded into the client-side JavaScript bundle at build time and visible in the browser.

### Docker Hub Authentication

The `docker-push.sh` script finds your Docker Hub username by checking (in order):

1. **Environment variable**: `export DOCKER_USERNAME=myusername`
2. **`.env.local` file**: `DOCKER_USERNAME=myusername` ✅ Recommended
3. **Interactive prompt**: Asks you to type it

For login, the script runs `docker login` which prompts for:

- Username
- Password (or personal access token)

This creates an authenticated session until you run `docker logout`.

### Supabase Edge Functions

Your Supabase Edge Functions work automatically! The app connects through the Supabase client using your configured URL and key. Just make sure your functions are deployed:

```bash
supabase functions deploy create-entries
supabase functions deploy get-entries
```

---

---

## Detailed Deployment Steps

This section provides more details if you need them.

### Building the Image

The `docker-build.sh` script automates the build process:

```bash
./docker-build.sh [optional-image-name]
```

What it does:

1. Checks for `.env.local` file
2. Validates required environment variables
3. Runs `docker build` with your Supabase credentials as build arguments
4. Creates a multi-stage Docker image:
   - **Builder stage**: Installs dependencies and builds Next.js app
   - **Runner stage**: Copies only the standalone output for a minimal image

You can verify the build succeeded by checking the image size:

```bash
docker images dagboks-appen
# Should show ~100-200MB for standalone build
```

### Testing Locally

Run your container to test before deploying:

```bash
# Foreground (see logs immediately)
docker run -p 3000:3000 dagboks-appen

# Background (detached mode)
docker run -d -p 3000:3000 --name my-app dagboks-appen

# View logs from background container
docker logs my-app

# Follow logs in real-time
docker logs -f my-app
```

Test your app at http://localhost:3000. Check that:

- Pages load correctly
- Supabase connection works
- Edge Functions are accessible
- Authentication flows work

### Pushing to Docker Hub

The `docker-push.sh` script handles tagging and pushing:

```bash
./docker-push.sh [image-name] [tag]
# Defaults: dagboks-appen latest
```

This will:

1. Find your Docker Hub username (from env/file/prompt)
2. Login to Docker Hub (if not already logged in)
3. Tag your local image: `username/dagboks-appen:latest`
4. Push to Docker Hub registry

**Pro tip**: You can create multiple tags for different environments:

```bash
./docker-push.sh dagboks-appen staging
./docker-push.sh dagboks-appen v1.0.0
```

### Deploying to Render

#### Option A: Using Render Dashboard (Recommended for First Deploy)

Step-by-step:

1. **Create Service**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Select "Deploy an existing image from a registry"

2. **Configure Image**
   - Image URL: `your-username/dagboks-appen:latest`
   - Or use a specific tag: `your-username/dagboks-appen:v1.0.0`

3. **Service Settings**
   - **Name**: `dagboks-appen` (becomes part of your URL)
   - **Region**: Oregon (or closest to your users)
   - **Instance Type**:
     - Free: Good for testing, sleeps after inactivity
     - Starter: $7/mo, always on, better performance

4. **Environment Variables** (Critical!)
   - Click "Add Environment Variable"
   - Add each variable:
     ```
     NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY = your-key-here
     ```
   - ⚠️ Don't skip this! The app won't work without these.

5. **Advanced Settings** (optional)
   - Auto-Deploy: Choose if Render should redeploy when you push new images
   - Health Check Path: `/` (default, already configured in Dockerfile)

6. **Deploy**
   - Click "Create Web Service"
   - Watch the deployment logs
   - Your app will be available at `https://dagboks-appen.onrender.com`

#### Option B: Using render.yaml (Infrastructure as Code)

For teams or multiple environments, use `render.yaml`:

1. **Edit render.yaml**

   ```yaml
   services:
     - type: web
       name: dagboks-appen
       runtime: docker
       image:
         url: your-username/dagboks-appen:latest
       plan: free
       region: oregon
       envVars:
         - key: NEXT_PUBLIC_SUPABASE_URL
           sync: false # Set in dashboard
         - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
           sync: false
   ```

2. **Connect GitHub**
   - Go to Render dashboard
   - New → Blueprint
   - Connect your GitHub repository
   - Render detects `render.yaml` and deploys automatically

3. **Set Environment Variables**
   - Go to your service in Render dashboard
   - Environment tab
   - Add your Supabase credentials

**Benefits of render.yaml**:

- Version control your infrastructure
- Easy to replicate environments
- Automatic deployments from git

---

## Updating Your Deployment

### Standard Update Workflow

When you make changes to your app, follow these steps:

```bash
# 1. Build the new image
./docker-build.sh

# 2. Test locally
docker run -p 3000:3000 dagboks-appen
# Verify everything works, then stop with Ctrl+C

# 3. Push to Docker Hub
./docker-push.sh

# 4. Deploy to Render
# Go to Render dashboard → Your Service → Manual Deploy
# Or wait for auto-deploy if enabled
```

### Quick Updates

For faster iterations during development:

```bash
# Build, test, and push in one go
./docker-build.sh && docker run -p 3000:3000 dagboks-appen
# Test, then Ctrl+C
./docker-push.sh
```

### Environment Variable Changes

If you need to update Supabase keys or other env vars:

**In Render:**

1. Go to your service → Environment tab
2. Update the values
3. Render will automatically restart your service

**Local testing:**

1. Update `.env.local`
2. Rebuild: `./docker-build.sh`
3. Test: `docker run -p 3000:3000 dagboks-appen`

### Version Tagging

For production deployments, use version tags:

```bash
# Build and tag with version
./docker-push.sh dagboks-appen v1.0.1

# Update Render to use specific version
# In Render: Change image URL to your-username/dagboks-appen:v1.0.1
```

**Benefits**:

- Easy rollbacks to previous versions
- Clear deployment history
- Safe testing of new versions

---

## Troubleshooting

### Build Issues

**"Error: .env.local file not found"**

```bash
cp .env.docker.example .env.local
# Edit with your credentials
```

**"NEXT_PUBLIC_SUPABASE_URL is not defined"**

- Check `.env.local` exists and has correct variable names
- Make sure there are no typos
- Ensure no extra spaces around `=` sign

**"npm ci failed"**

- Clear Docker cache: `docker builder prune`
- Try again: `./docker-build.sh`

### Runtime Issues

**"Port 3000 already in use"**

```bash
# Find what's using the port
lsof -ti:3000

# Stop any running Docker containers
docker ps
docker stop <container-id>

# Or use a different port
docker run -p 3001:3000 dagboks-appen
```

**"Container exits immediately"**

```bash
# Check logs for errors
docker ps -a  # Find container ID
docker logs <container-id>

# Common causes:
# - Missing environment variables
# - Port conflicts
# - Build failed but image was created
```

**"Cannot connect to Docker daemon"**

- Make sure Docker Desktop is running
- On Mac: Check Docker Desktop in menu bar
- On Windows: Check Docker Desktop is started
- Restart Docker Desktop if needed

### Deployment Issues

**"App doesn't connect to Supabase"**

- Verify environment variables are set correctly in Render
- Check Supabase URL doesn't have trailing slash
- Confirm anon key is the public key, not the service role key
- Check Supabase project is not paused
- Verify RLS policies allow your operations

**"Image pull failed" in Render**

- Check image name is correct: `username/dagboks-appen:latest`
- Verify image exists on Docker Hub: visit `hub.docker.com/r/username/dagboks-appen`
- If private image, add Docker Hub credentials in Render
- Check for typos in image URL

**"App works locally but not on Render"**

- Environment variables must be set in Render dashboard
- Check Render logs for specific errors
- Verify health check endpoint is accessible
- Ensure port 3000 is exposed (already in Dockerfile)

### Docker Hub Issues

**"DOCKER_USERNAME not set"**

```bash
# Add to .env.local
echo "DOCKER_USERNAME=your-username" >> .env.local

# Or export as environment variable
export DOCKER_USERNAME=your-username
```

**"unauthorized: incorrect username or password"**

```bash
# Login manually
docker login
# Enter credentials

# If using 2FA, create an access token at hub.docker.com
# Use token as password when logging in
```

**"denied: requested access to the resource is denied"**

- Check you're logged into the correct Docker Hub account
- Verify username matches exactly (case-sensitive)
- Ensure you have permission to push to that repository

### Image Size Issues

**"Image is larger than expected"**

```bash
# Check current size
docker images dagboks-appen

# Should be ~100-200MB with standalone mode
# If much larger:

# 1. Verify standalone mode is enabled
cat next.config.ts  # Should have output: 'standalone'

# 2. Check .dockerignore is working
cat .dockerignore

# 3. Rebuild from scratch
docker builder prune -a
./docker-build.sh
```

---

---

## Docker Commands Reference

### Essential Commands

```bash
# Build image
./docker-build.sh [image-name]

# Run container (foreground)
docker run -p 3000:3000 dagboks-appen

# Run in background
docker run -d -p 3000:3000 --name my-app dagboks-appen

# Push to Docker Hub
./docker-push.sh [image-name] [tag]
```

### Container Management

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a container
docker stop <container-id-or-name>

# Start a stopped container
docker start <container-id-or-name>

# Remove a container
docker rm <container-id-or-name>

# Remove all stopped containers
docker container prune
```

### Image Management

```bash
# List images
docker images

# Check image size
docker images dagboks-appen

# Remove an image
docker rmi dagboks-appen

# Remove unused images
docker image prune

# Remove all unused images (careful!)
docker image prune -a
```

### Logs and Debugging

```bash
# View logs
docker logs <container-id>

# Follow logs in real-time
docker logs -f <container-id>

# Show last 100 lines
docker logs --tail 100 <container-id>

# Execute command inside running container
docker exec -it <container-id> sh

# Inspect container details
docker inspect <container-id>
```

### Cleanup

```bash
# Remove stopped containers, unused networks, dangling images
docker system prune

# Remove everything (including unused images)
docker system prune -a

# Check disk usage
docker system df
```

---

## Security Best Practices

### Environment Variables

✅ **Do:**

- Store credentials in `.env.local` (already in `.gitignore`)
- Use Render's environment variable feature
- Rotate keys regularly

❌ **Don't:**

- Commit `.env.local` to git
- Hardcode credentials in code
- Share `.env.local` files publicly

### Supabase Security

✅ **Do:**

- Use Row Level Security (RLS) policies
- Use the anon key for client-side operations
- Restrict API access to your domain in Supabase settings
- Enable email verification for user signups

❌ **Don't:**

- Use the service role key in client-side code
- Expose database directly without RLS
- Allow anonymous writes without proper policies

### Docker Security

✅ **Do:**

- Run containers as non-root user (already in Dockerfile)
- Keep base images updated (`node:22-alpine`)
- Use specific image versions in production
- Scan images for vulnerabilities: `docker scan dagboks-appen`

❌ **Don't:**

- Run containers as root unnecessarily
- Use `latest` tag in production
- Include unnecessary files in image

### Render Security

✅ **Do:**

- Use HTTPS (automatic with Render)
- Enable automatic deploys from protected branches
- Set up health checks
- Monitor logs for suspicious activity

❌ **Don't:**

- Use free tier for production apps (sleep after inactivity)
- Expose sensitive endpoints without authentication
- Ignore security updates

---

## Advanced Topics

### Multiple Environments

Create separate images for different environments:

```bash
# Development
./docker-build.sh dagboks-appen-dev
./docker-push.sh dagboks-appen-dev dev

# Staging
./docker-build.sh dagboks-appen-staging
./docker-push.sh dagboks-appen-staging staging

# Production
./docker-build.sh dagboks-appen
./docker-push.sh dagboks-appen v1.0.0
```

Use separate Supabase projects and Render services for each environment.

### Custom Domains

To use your own domain on Render:

1. Go to your service → Settings → Custom Domains
2. Add your domain (e.g., `app.yourdomain.com`)
3. Update DNS records with provided values
4. Render automatically provisions SSL certificate

### Monitoring and Logs

**Render built-in:**

- View logs in real-time from dashboard
- Set up log drains to external services
- Monitor metrics (CPU, memory, requests)

**Add custom monitoring:**

- Integrate Sentry for error tracking
- Use Supabase dashboard for database metrics
- Set up Uptime Robot for availability monitoring

### CI/CD Integration

Automate your deployment with GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build and push Docker image
        env:
          DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
          DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
        run: |
          echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
          ./docker-build.sh
          ./docker-push.sh
```

Add secrets in GitHub repository settings.

### Performance Optimization

**Reduce build time:**

- Use `.dockerignore` effectively (already configured)
- Leverage Docker layer caching
- Use `npm ci` instead of `npm install` (already in Dockerfile)

**Reduce image size:**

- Standalone mode (already enabled)
- Multi-stage builds (already implemented)
- Use Alpine Linux base image (already using)

**Improve runtime:**

- Use CDN for static assets
- Enable Render's CDN feature
- Optimize Next.js build configuration
- Use Supabase edge functions for backend logic

---

## Using Supabase Edge Functions

Your Supabase Edge Functions will work automatically! The app connects to them through the Supabase client using your configured URL and key.

Make sure your Edge Functions are deployed to Supabase:

```bash
supabase functions deploy create-entries
supabase functions deploy get-entries
```

**Testing Edge Functions locally:**

```bash
# Start Supabase locally
supabase start

# Deploy functions locally
supabase functions serve

# Test your app with local functions
# Update .env.local with local Supabase URL
```

---

## Additional Resources

### Documentation

- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Render Docker Deployment](https://render.com/docs/deploy-an-image)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### Support

- Render Support: [render.com/support](https://render.com/support)
- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- Docker Forums: [forums.docker.com](https://forums.docker.com)

### Related Files in This Project

- `Dockerfile` - Multi-stage build configuration
- `docker-build.sh` - Automated build script
- `docker-push.sh` - Push to Docker Hub script
- `.dockerignore` - Files excluded from build
- `render.yaml` - Infrastructure as code configuration
- `.env.docker.example` - Environment variables template

---

## Quick Reference

**Build → Test → Deploy:**

```bash
./docker-build.sh && \
docker run -p 3000:3000 dagboks-appen && \
./docker-push.sh
```

**Check everything is working:**

```bash
docker ps                    # Running?
docker logs <container-id>   # Any errors?
docker images dagboks-appen  # Right size?
```

**Clean up:**

```bash
docker stop $(docker ps -q)  # Stop all
docker system prune          # Clean up
```

**Get help:**

```bash
./docker-build.sh --help
./docker-push.sh --help
docker --help
docker run --help
```

---

_Last updated: November 2025_  
_For issues or questions, check the Troubleshooting section or create an issue in the repository._
