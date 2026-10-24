# Pylon — GitHub Repository & Deployment Guide

This document defines how the Pylon website (`bypylon.com`) is hosted on GitHub Pages for **$0/month**, with automatic deployments, version control, and free SSL.

---

## 🛠️ Step-by-Step: Initializing & Deploying on GitHub

Your machine already has the GitHub CLI (`gh`) authenticated with:
* **Active Account:** `mukpostproduction-debug` (or your Pylon organization).

### Step 1: Initialize Git in the Website Folder (or Root)
You can deploy either the entire Pylon workspace (with `website/` configured for Pages) or create a dedicated repository specifically for the public site:

**Option A (Recommended: Dedicated Public Site Repo `bypylon`):**
```bash
# Navigate to the website folder
cd /Users/jacksonmcmurdo/Desktop/Pylon/website

# Initialize git repository
git init -b main
git add .
git commit -m "Initial commit: Pylon web platform for bypylon.com"

# Create public GitHub repository via gh CLI:
gh repo create bypylon --public --source=. --remote=origin --push
```

### Step 2: Enable GitHub Pages & Custom Domain
Once the repository is pushed:
```bash
# Enable GitHub Pages on main branch root:
gh api --method POST -H "Accept: application/vnd.github+json" \
  /repos/mukpostproduction-debug/bypylon/pages \
  -f "source[branch]=main" -f "source[path]=/"

# Set the custom domain to bypylon.com:
gh api --method PUT -H "Accept: application/vnd.github+json" \
  /repos/mukpostproduction-debug/bypylon/pages \
  -f "cname=bypylon.com"
```

*(Or via GitHub Web UI: Go to **Settings** → **Pages** → Source: `Deploy from a branch (main / root)` → Custom domain: `bypylon.com` → Save).*

### Step 3: Enforce HTTPS
Once GitHub verifies the DNS records on Spaceship (usually 5–15 minutes):
* Check the box: **"Enforce HTTPS"**.
* GitHub will automatically request and renew a free Let's Encrypt SSL certificate.

---

## 🔄 Daily Deployment Workflow
Whenever you make updates to the HTML, CSS, or portfolio:
```bash
git add .
git commit -m "Update portfolio reel and director roster"
git push origin main
# GitHub Pages deploys live to bypylon.com in ~30 seconds automatically!
```
