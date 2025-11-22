# Scripts

> Build, deployment, and utility scripts for Car Transport Service

## 📋 Available Scripts

Currently, this directory is prepared for future automation scripts.

## 🔮 Planned Scripts

### Build Scripts
- `build.sh` - Production build script
- `build-frontend.sh` - Frontend build only
- `build-backend.sh` - Backend build only

### Deployment Scripts
- `deploy.sh` - Full deployment script
- `deploy-staging.sh` - Deploy to staging environment
- `deploy-production.sh` - Deploy to production

### Development Scripts
- `dev-setup.sh` - Initial development environment setup
- `install-deps.sh` - Install all dependencies
- `start-dev.sh` - Start development servers

### Database Scripts
- `db-migrate.sh` - Run database migrations
- `db-seed.sh` - Seed database with test data
- `db-backup.sh` - Backup database

### Testing Scripts
- `run-tests.sh` - Run all tests
- `run-frontend-tests.sh` - Frontend tests only
- `run-backend-tests.sh` - Backend tests only

### Utility Scripts
- `clean.sh` - Clean build artifacts
- `update-deps.sh` - Update dependencies
- `generate-docs.sh` - Generate documentation

## 📝 Usage Guidelines

### Creating New Scripts

1. **Use descriptive names**
   ```bash
   deploy-to-production.sh  # Good
   deploy.sh               # Less clear
   ```

2. **Add documentation**
   ```bash
   #!/bin/bash
   # Deploy application to production
   # Usage: ./deploy-production.sh [version]
   ```

3. **Include error handling**
   ```bash
   set -e  # Exit on error
   set -u  # Exit on undefined variable
   ```

4. **Make executable**
   ```bash
   chmod +x script-name.sh
   ```

### Running Scripts

```bash
# From project root
./scripts/script-name.sh

# Or with bash
bash scripts/script-name.sh
```

## 🔒 Security Notes

- Never commit credentials or API keys in scripts
- Use environment variables for sensitive data
- Review scripts before executing from external sources

## 🤝 Contributing

When adding new scripts:
- Follow existing naming conventions
- Add proper documentation
- Test thoroughly before committing
- Update this README

---

**Last Updated:** November 15, 2025
