# GitHub Actions Workflows Documentation

This directory contains automated workflows for CI/CD, testing, and deployment of the Jewel ICU Airdrop project.

## Available Workflows

### 1. CI - Test and Lint (`ci.yml`)

**Trigger:** Push to `main`/`develop` branches or Pull Requests to `main`

**Purpose:** Runs automated tests, security scans, and code quality checks

**Jobs:**
- **test-backend**: Tests the Node.js backend with PostgreSQL
- **security-scan**: Runs Trivy vulnerability scanner
- **validate-frontend**: Validates HTML and JavaScript files

**Required Secrets:** None (uses GitHub token automatically)

### 2. Deploy to Render (`deploy-render.yml`)

**Trigger:** Push to `main` branch or manual workflow dispatch

**Purpose:** Deploys the application to Render hosting platform

**Jobs:**
- **deploy**: Triggers deployment via Render API
- **health-check**: Verifies deployment success

**Required Secrets:**
- `RENDER_API_KEY`: Your Render API key (get from Render dashboard)
- `RENDER_SERVICE_ID`: Your Render service ID
- `RENDER_SERVICE_URL`: Your deployed service URL (optional, for health checks)

### 3. Docker Build and Push (`docker.yml`)

**Trigger:** Push to `main`, tags, or Pull Requests

**Purpose:** Builds and publishes Docker images to GitHub Container Registry and Docker Hub

**Jobs:**
- **build-and-push**: Multi-platform Docker image build
- **docker-compose-test**: Tests Docker Compose setup

**Optional Secrets:**
- `DOCKER_USERNAME`: Docker Hub username (optional)
- `DOCKER_PASSWORD`: Docker Hub password (optional)

## Setting Up Secrets

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add the following secrets:

### Required for Render Deployment:
```
RENDER_API_KEY=your-render-api-key
RENDER_SERVICE_ID=srv-xxxxxxxxxxxxx
RENDER_SERVICE_URL=https://your-service.onrender.com
```

### Optional for Docker Hub:
```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password
```

## Workflow Usage

### Manual Deployment

You can manually trigger a deployment:

1. Go to Actions tab in your repository
2. Select "Deploy to Render" workflow
3. Click "Run workflow"
4. Choose the environment (production/staging)
5. Click "Run workflow" button

### Monitoring Workflows

- Check the Actions tab for workflow runs
- Each workflow provides detailed logs
- Failed workflows will show ❌ with error details
- Successful workflows show ✅

## Dependabot Configuration

The repository includes Dependabot configuration (`.github/dependabot.yml`) for automated dependency updates:

- **npm packages**: Weekly updates for backend dependencies
- **Docker base images**: Weekly security updates
- **GitHub Actions**: Weekly updates for action versions
- **Cargo/Rust**: Weekly updates for smart contract dependencies

### Customizing Dependabot

Edit `.github/dependabot.yml` and replace `@your-github-username` with your actual GitHub username for:
- Reviewers
- Assignees

## Best Practices

1. **Branch Protection**: Enable branch protection rules for `main`:
   - Require pull request reviews
   - Require status checks to pass (CI workflow)
   - Require branches to be up to date

2. **Secrets Management**:
   - Never commit secrets to the repository
   - Use GitHub Secrets for sensitive data
   - Rotate API keys regularly

3. **Workflow Optimization**:
   - Workflows use caching for faster builds
   - Multi-platform Docker builds for compatibility
   - Parallel job execution where possible

## Troubleshooting

### CI Failures

1. **PostgreSQL Connection Issues**:
   - Check if the test database is properly configured
   - Ensure migrations run successfully

2. **Node.js Issues**:
   - Verify `package-lock.json` is committed
   - Check Node.js version compatibility

### Deployment Failures

1. **Render Deployment**:
   - Verify API key and service ID are correct
   - Check Render service logs
   - Ensure environment variables are set in Render

2. **Docker Build**:
   - Check Dockerfile syntax
   - Verify base image availability
   - Review multi-stage build steps

### Security Scan Issues

- Trivy may report vulnerabilities in dependencies
- Review and update packages as needed
- Some vulnerabilities may require base image updates

## Contributing

When adding new workflows:

1. Test locally using [act](https://github.com/nektos/act)
2. Document required secrets
3. Add workflow description to this README
4. Consider security implications

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render API Documentation](https://api-docs.render.com/)
- [Docker Build Action](https://github.com/docker/build-push-action)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)