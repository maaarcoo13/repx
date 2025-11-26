# GitHub Workflow Guide for RepX Team

## 🚨 IMPORTANT: Always Pull Before You Start Working!

To avoid overwriting each other's work, **ALWAYS** follow this workflow:

---

## Daily Workflow

### 1. Before Starting Work (EVERY TIME)

```bash
# Navigate to your project folder
cd "/Users/shanirshad/Desktop/repx-main 2"

# Pull the latest changes from GitHub
git pull origin main
```

**Why?** This downloads any changes your teammates made and uploaded to GitHub.

---

### 2. While Working

Make your changes to the code as normal. You can check what files you've changed:

```bash
# See what files you've modified
git status
```

---

### 3. After Making Changes (Upload to GitHub)

#### Step A: Stage Your Changes
```bash
# Add all your changes
git add .

# OR add specific files only
git add src/app/routine/routine.page.html
git add src/app/friends/friends.page.html
```

#### Step B: Commit Your Changes
```bash
# Commit with a descriptive message
git commit -m "Added Routine Page and Friends & Groups Page"

# Examples of good commit messages:
# git commit -m "Fixed login button styling"
# git commit -m "Updated profile page layout"
# git commit -m "Added workout tracking feature"
```

#### Step C: Push to GitHub
```bash
# Upload your changes to GitHub
git push origin main
```

---

## Complete Example Workflow

```bash
# 1. PULL FIRST (get latest changes)
git pull origin main

# 2. Make your changes in the code...
# (edit files, create new pages, etc.)

# 3. Check what you changed
git status

# 4. Add your changes
git add .

# 5. Commit with a message
git commit -m "Describe what you changed"

# 6. Push to GitHub
git push origin main
```

---

## 🔥 Quick Commands Reference

| Command | What it does |
|---------|-------------|
| `git pull origin main` | Download latest changes from GitHub |
| `git status` | See what files you've changed |
| `git add .` | Stage all your changes |
| `git add filename` | Stage a specific file |
| `git commit -m "message"` | Save your changes with a description |
| `git push origin main` | Upload your changes to GitHub |
| `git log --oneline` | See recent commits |

---

## ⚠️ Common Issues and Solutions

### Issue 1: "Your local changes would be overwritten by merge"

**Solution:**
```bash
# Save your changes temporarily
git stash

# Pull the latest changes
git pull origin main

# Reapply your changes
git stash pop
```

### Issue 2: Merge Conflicts

If you see a merge conflict message:

1. Open the conflicting file(s)
2. Look for sections marked with `<<<<<<<`, `=======`, `>>>>>>>`
3. Manually choose which code to keep
4. Remove the conflict markers
5. Then:
```bash
git add .
git commit -m "Resolved merge conflicts"
git push origin main
```

### Issue 3: "Permission denied" or Authentication Error

Make sure you're logged into GitHub in your terminal. You may need to set up a Personal Access Token.

---

## 📋 Best Practices

### ✅ DO:
- **Pull before you start working** (every single time!)
- **Commit often** with clear messages
- **Push your changes** at the end of each work session
- **Communicate** with your team about what you're working on
- **Test your code** before pushing

### ❌ DON'T:
- Don't work on the same file at the same time as teammates
- Don't forget to pull before starting
- Don't use vague commit messages like "updated stuff"
- Don't push broken code

---

## 🗓️ Recommended Schedule

**Before each work session:**
```bash
git pull origin main
```

**After each work session:**
```bash
git add .
git commit -m "Description of what you did"
git push origin main
```

**Before taking a break:**
```bash
git push origin main
```

---

## 👥 Team Coordination

### Current Page Assignments
- **Home Page**: ✅ Complete
- **Login Page**: ✅ Complete  
- **Profile Page**: ✅ Complete
- **Physique Page**: 🔄 In Progress (Current teammate)
- **Routine Page**: ✅ Complete (Just added)
- **Friends & Groups Page**: ✅ Complete (Just added)

### Avoid Conflicts
- Don't edit pages that someone else is actively working on
- If you need to work on the same area, coordinate in your group chat
- Use different branches if working on major features (ask ChatGPT about branches)

---

## 🆘 Need Help?

If you get stuck:

1. **Check the error message** - it usually tells you what's wrong
2. **Ask ChatGPT** - Copy and paste the error message
3. **Ask your teammates** - They might have seen the same issue
4. **Google the error** - Many developers have solved the same problems

---

## 📱 GitHub Desktop (Alternative)

If you prefer a visual interface instead of command line:

1. Download **GitHub Desktop** from https://desktop.github.com/
2. Clone your repository
3. Use the GUI to:
   - Pull changes (Fetch origin button)
   - Commit changes (write message and click Commit)
   - Push changes (Push origin button)

---

## Summary: The Golden Rule

```
PULL → WORK → ADD → COMMIT → PUSH
```

**Never skip the PULL step!** 🎯

---

**Questions?** Ask ChatGPT or your teammates!

Good luck with your project! 🚀
