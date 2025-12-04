# Git & Vercel Setup Instructions

## Step 1: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the "+" icon in the top right → "New repository"
3. Repository name: `shivhardware` (or `shiv-hardware-store`)
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have files)
6. Click "Create repository"

## Step 2: Add Remote and Push

After creating the repository, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/shivhardware.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Deploy to Vercel

1. Go to https://vercel.com and sign in (use GitHub account)
2. Click "Add New Project"
3. Import your `shivhardware` repository
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"
6. Your site will be live in minutes!

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:
```bash
gh repo create shivhardware --public --source=. --remote=origin --push
```

