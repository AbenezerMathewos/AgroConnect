# Auto-Commit Rule

Whenever code changes are made by the agent or detected in the workspace (via `git status` / `git diff`), the agent must automatically stage all changes and commit them.

**Instructions for the Agent:**
1. Check for uncommitted changes using `git status` when appropriate.
2. If changes exist, use `git diff` to review them.
3. Automatically run `git add .` and `git commit -m "<precise_message>"` without waiting for user prompting.
4. Ensure the commit message is precise, descriptive, and follows conventional commit formatting.
