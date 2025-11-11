#!/bin/bash

# Docker Build Script for Dagboks-appen
# This script builds the Docker image with your Supabase credentials

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🐳 Building Docker image for Dagboks-appen${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo "Please create .env with your Supabase credentials."
    echo "You can copy .env.example as a template."
    exit 1
fi

# Load environment variables from .env
export $(cat .env | grep -v '^#' | xargs)

# Check if required variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}❌ Error: Missing required environment variables${NC}"
    echo "Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env"
    exit 1
fi

# Optional: Warn if GOOGLE_API_KEY is missing (AI functionality won't work)
if [ -z "$GOOGLE_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  Warning: GOOGLE_API_KEY not set${NC}"
    echo "AI analysis features will not work without this key."
    echo ""
fi

# Get image name from .env or command line argument
IMAGE_NAME="${1:-${IMAGE_NAME:-my-app}}"

echo -e "${GREEN}Building image: ${IMAGE_NAME}${NC}"
echo -e "${YELLOW}Building for platform: linux/amd64 (Render compatible)${NC}"
echo ""

# Build the Docker image with build arguments for linux/amd64 platform
docker build \
  --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --build-arg GOOGLE_API_KEY="$GOOGLE_API_KEY" \
  -t "$IMAGE_NAME" \
  .

echo ""
echo -e "${GREEN}✅ Build complete!${NC}"
echo ""
echo "To run the container locally:"
echo -e "${YELLOW}  docker run -p 3000:3000 ${IMAGE_NAME}${NC}"
echo ""
echo "To push to Docker Hub (after logging in):"
echo -e "${YELLOW}  ./docker-push.sh ${IMAGE_NAME}${NC}"
