# Contributing to FlashIQ

## Commit Message Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to ensure consistent and readable commit history.

### Commit Message Format
```
<type>(<scope>): <description>
```

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

### Examples
```bash
feat(auth): add user registration endpoint
fix(flashcard): resolve duplicate card creation bug
docs(readme): update installation instructions
style(api): format code with prettier
refactor(database): optimize query performance
test(auth): add unit tests for login service
chore(deps): update express to version 5.2.1
```

### Scope (Optional)
- `auth` - Authentication related changes
- `flashcard` - Flashcard functionality
- `api` - API endpoints
- `database` - Database related changes
- `ui` - User interface changes

### Validation
Commitlint will automatically validate your commit messages. Invalid commits will be rejected.

### Quick Tips
- Use present tense ("add feature" not "added feature")
- Keep the first line under 72 characters
- Reference issues when applicable: `fix(auth): resolve login bug (#123)`