#!/bin/bash

# Docker Push Script for Dagboks-appen
# This script tags and pushes your image to Docker Hub

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Pushing Docker image to Docker Hub${NC}"
echo ""

# Get Docker Hub username from:
# 1. Environment variable DOCKER_USERNAME
# 2. .env.local file
# 3. Prompt user
if [ -z "$DOCKER_USERNAME" ]; then
    # Try to load from .env.local
    if [ -f .env.local ]; then
        export $(cat .env.local | grep "^DOCKER_USERNAME=" | xargs) 2>/dev/null || true
    fi
fi

# If still not set, prompt user
if [ -z "$DOCKER_USERNAME" ]; then
    read -p "Enter your Docker Hub username: " DOCKER_USERNAME
fi

if [ -z "$DOCKER_USERNAME" ]; then
    echo -e "${RED}❌ Error: Docker Hub username is required${NC}"
    echo ""
    echo "You can set it by:"
    echo "1. Adding DOCKER_USERNAME=your-username to .env.local"
    echo "2. Setting environment variable: export DOCKER_USERNAME=your-username"
    echo "3. Passing it when prompted"
    exit 1
fi

# Get local image name from .env.local or command line argument
LOCAL_IMAGE="${1:-${IMAGE_NAME:-my-app}}"

# Get tag (default: latest)
TAG="${2:-latest}"

# Full Docker Hub image name
DOCKER_HUB_IMAGE="${DOCKER_USERNAME}/${LOCAL_IMAGE}:${TAG}"

echo -e "${GREEN}Local image: ${LOCAL_IMAGE}${NC}"
echo -e "${GREEN}Docker Hub image: ${DOCKER_HUB_IMAGE}${NC}"
echo ""

# Check if local image exists
if ! docker image inspect "$LOCAL_IMAGE" >/dev/null 2>&1; then
    echo -e "${RED}❌ Error: Local image '${LOCAL_IMAGE}' not found${NC}"
    echo "Please build the image first using:"
    echo -e "${YELLOW}  ./docker-build.sh${NC}"
    exit 1
fi

# Login to Docker Hub
echo -e "${YELLOW}Logging in to Docker Hub...${NC}"
docker login

# Tag the image
echo -e "${YELLOW}Tagging image...${NC}"
docker tag "$LOCAL_IMAGE" "$DOCKER_HUB_IMAGE"

# Push to Docker Hub
echo -e "${YELLOW}Pushing to Docker Hub...${NC}"
docker push "$DOCKER_HUB_IMAGE"

echo ""
echo -e "${GREEN}✅ Successfully pushed to Docker Hub!${NC}"
echo ""
echo "Image available at:"
echo -e "${GREEN}  ${DOCKER_HUB_IMAGE}${NC}"
echo ""
echo "To use this in Render:"
echo "1. Go to Render Dashboard → New Web Service"
echo "2. Choose 'Deploy an existing image from a registry'"
echo "3. Enter image URL: ${DOCKER_HUB_IMAGE}"
echo "4. Set environment variables:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
