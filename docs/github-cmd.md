# Git Commands Reference

---

## 1. Configuration

```bash
# Set global username and email
git config --global user.name "Your Name"
git config --global user.email "you@email.com"

# View current configuration
git config --list

# Set default editor (e.g. VSCode)
git config --global core.editor "code --wait"

# Set default branch name to 'main'
git config --global init.defaultBranch main
```

---

## 2. Init & Clone

```bash
# Initialize a new repository
git init

# Initialize in a named folder
git init my-project

# Clone a remote repository
git clone https://github.com/user/repo.git

# Clone into a specific folder
git clone https://github.com/user/repo.git my-folder

# Clone a specific branch
git clone -b main https://github.com/user/repo.git
```

---

## 3. Status & History

```bash
# Show working directory status
git status

# View commit history
git log

# Compact log (one line per commit)
git log --oneline

# Log with branch graph
git log --oneline --graph --all

# Show unstaged changes
git diff

# Show staged changes (ready to commit)
git diff --staged

# Show the content of a commit
git show <commit-hash>

# Show files changed by a commit (summary)
git show --stat <commit-hash>

# Show stats of the latest commit
git show --stat HEAD
```

---

## 4. Staging & Commit

```bash
# Stage a specific file
git add file.txt

# Stage all modified files
git add .

# Stage interactively (choose hunks)
git add -p

# Create a commit
git commit -m "feat: add home page"

# Stage + commit in one command (tracked files only)
git commit -am "fix: fix login bug"

# Amend the last commit (message or files)
git commit --amend -m "feat: updated commit message"

# Amend the last commit without changing the message
git commit --amend --no-edit
```

---

## 5. Branches

```bash
# List all local branches
git branch

# List all branches (local + remote)
git branch -a

# Create a new branch
git branch <branch-name>

# Switch to a branch
git checkout <branch-name>

# Create and switch to a branch (shortcut)
git checkout -b <branch-name>

# Modern syntax (Git 2.23+)
git switch -c <branch-name>

# Rename the current branch
git branch -m <new-name>

# Rename a specific branch (from anywhere)
git branch -m <old-name> <new-name>

# Force rename — overwrites if <new-name> already exists
git branch -M <new-name>

# Delete a local branch
git branch -d <branch-name>

# Force delete (even if not merged)
git branch -D <branch-name>
```

---

## 6. Merge & Rebase

```bash
# Merge a branch into the current branch
git merge <branch-name>

# Merge without fast-forward (preserves history)
git merge --no-ff <branch-name>

# Rebase current branch onto main
git rebase main

# Interactive rebase (reorder last N commits)
git rebase -i HEAD~3

# Abort an ongoing rebase
git rebase --abort

# Continue after resolving conflicts
git rebase --continue
```

---

## 7. Remote (Push / Pull / Fetch)

```bash
# View remote repositories
git remote -v

# Add a remote repository
git remote add origin https://github.com/user/repo.git

# Push a branch to remote
git push origin <branch-name>

# Push and set upstream tracking
git push -u origin <branch-name>

# Push all branches
git push --all

# Fetch remote changes (without merging)
git fetch origin

# Fetch and merge (fetch + merge)
git pull

# Pull with rebase instead of merge
git pull --rebase

# Delete a remote branch
git push origin --delete <branch-name>
```

---

## 8. Stash

```bash
# Save current changes aside
git stash

# Stash with a descriptive message
git stash save "WIP: add login form"

# List all stashes
git stash list

# Re-apply the latest stash
git stash pop

# Re-apply a specific stash
git stash apply stash@{2}

# Delete a specific stash
git stash drop stash@{0}

# Clear all stashes
git stash clear
```

---

## 9. Tags

```bash
# List all tags
git tag

# Create a lightweight tag
git tag v1.0.0

# Create an annotated tag (recommended)
git tag -a v1.0.0 -m "Version 1.0.0 - Initial release"

# Create a tag on a specific commit
git tag -a v1.0.0 <commit-hash>

# Push a tag to remote
git push origin v1.0.0

# Push all tags
git push origin --tags

# Delete a local tag
git tag -d v1.0.0

# Delete a remote tag
git push origin --delete v1.0.0
```

---

## 10. Undo / Fix

```bash
# Unstage a file (keep changes)
git restore --staged file.txt

# Discard changes in a file (revert to HEAD)
git restore file.txt

# Create a commit that reverts a previous commit
git revert <commit-hash>

# Reset to previous commit (keep files)
git reset --soft HEAD~1

# Reset to previous commit (unstage files)
git reset --mixed HEAD~1

# Reset to previous commit (DISCARD all changes)
git reset --hard HEAD~1

# Remove untracked files and folders
git clean -fd

# Restore an entire folder from a specific commit
git checkout <commit-hash> -- src/components/

# Restore multiple folders from a commit
git checkout <commit-hash> -- src/lib/ src/app/

# Restore a folder from the main branch
git checkout main -- src/config/

# Restore a folder from the previous commit (HEAD~1)
git checkout HEAD~1 -- src/components/Button/
```

---

## 11. Cherry-pick & Advanced

```bash
# Apply a specific commit onto the current branch
git cherry-pick <commit-hash>

# Cherry-pick without auto-committing
git cherry-pick --no-commit <commit-hash>

# Find the commit that introduced a bug (binary search)
git bisect start
git bisect bad                  # Current commit is broken
git bisect good <old-hash>      # This commit was good
git bisect reset                # End the bisect session

# Show who changed each line of a file
git blame file.ts

# Search for a string in commit history
git log -S "searchedText" --oneline

# Search in commit messages
git log --grep="feat" --oneline
```

---

## 12. Conventional Commits (Recommended format)

```bash
# Conventional commit types
git commit -m "feat: add OAuth authentication"
git commit -m "fix: fix redirect after login"
git commit -m "docs: update README"
git commit -m "style: reformat components with Prettier"
git commit -m "refactor: extract session logic"
git commit -m "test: add unit tests for auth service"
git commit -m "chore: update dependencies"
git commit -m "perf: optimize Prisma queries"
git commit -m "ci: configure GitHub Actions"

# With scope (context)
git commit -m "feat(auth): add Google sign-in"
git commit -m "fix(api): fix 500 status on /users"

# Breaking change
git commit -m "feat!: refactor REST API (breaking change)"
```
