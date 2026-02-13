#!/bin/bash

# ✅ Exit on any error
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting Deployment...${NC}"

# Step 1: Pull latest code
echo -e "${GREEN}📥 Step 1: Pulling latest code...${NC}"
git pull origin main
echo -e "${GREEN}✅ Git pull complete${NC}"

# Step 2: Install dependencies
echo -e "${GREEN}📦 Step 2: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 3: Build
echo -e "${GREEN}🔨 Step 3: Building project...${NC}"
npm run build
echo -e "${GREEN}✅ Build complete${NC}"

# Step 4: Restart PM2
echo -e "${GREEN}🔄 Step 4: Restarting PM2...${NC}"
pm2 restart all
echo -e "${GREEN}✅ PM2 restarted${NC}"

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"