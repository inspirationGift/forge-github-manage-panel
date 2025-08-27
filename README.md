# GitHub Management Panel for Jira - Demo App

A comprehensive Forge application that seamlessly integrates GitHub repositories with Jira tickets, enabling efficient pull request management and automated workflow transitions directly from your Jira interface.

## 🚀 App Overview

This demo application demonstrates the power of Atlassian Forge by creating a bridge between GitHub and Jira, allowing teams to manage their development workflow without leaving their project management environment.

### Key Features

- **🔐 Secure Authentication**: Save your GitHub API token securely in Forge storage
- **📋 Repository Management**: View and manage all your GitHub repositories
- **🔗 Smart PR Integration**: Automatically link pull requests to Jira tickets using naming conventions
- **⚡ One-Click Operations**: Merge pull requests directly from Jira
- **🎯 Automated Workflows**: Automatically transition Jira tickets to "Done" when PRs are merged
- **📊 Rich Information Display**: View repository details, PR status, and ticket information in one place

## 🛠️ Initial Setup

### Prerequisites

1. **Create your Jira site**

   - Set up an Atlassian Cloud instance with Jira
   - Ensure you have admin privileges

2. **Install Forge CLI and create template app**

   ```bash
   npm install -g @forge/cli
   forge create my-github-jira-app --template jira-admin-page
   ```

   For detailed module reference, see: [Jira Admin Page Module Documentation](https://developer.atlassian.com/platform/forge/manifest-reference/modules/jira-admin-page/)

## 📱 Application Architecture

### Screen 1: Authentication

- **Purpose**: Secure token management
- **Features**:
  - Input field for GitHub API token
  - Secure storage using Forge storage API
  - Token validation and management

### Screen 2: Main Dashboard

- **Repository List**: Display all accessible GitHub repositories with metadata
- **Pull Request Integration**: Show PRs linked to Jira tickets
- **Ticket Information**: Display related Jira ticket details with status
- **Action Controls**: Merge buttons and status updates

## 🔧 Core Functionality

### GitHub Integration

#### Repository Management

- **Endpoint**: `GET /user/repos`
- **Documentation**: [GitHub Repos API](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28)
- **Features**: Repository listing with language, visibility, and metadata

#### Pull Request Operations

- **List PRs**: `GET /repos/{owner}/{repo}/pulls`
- **Merge PR**: `PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge`
- **Documentation**: [GitHub Pull Requests API](https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28)

### Jira Integration

#### Ticket Information

- **Endpoint**: `/rest/api/3/issue/{issueIdOrKey}`
- **Method**: Use `requestJira` for authenticated calls
- **Documentation**:
  - [Jira Issues API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-get)
  - [Forge requestJira Method](https://developer.atlassian.com/platform/forge/apis-reference/ui-api-bridge/requestJira/)

#### Smart Ticket Linking

The application parses PR names and branch names to extract Jira ticket keys:

**Examples**:

- `KAN-1: first-commit` → Links to ticket `KAN-1`
- `[PROJ-123] feature update` → Links to ticket `PROJ-123`
- `(BUG-456) hotfix` → Links to ticket `BUG-456`

#### Automated Workflows

- **Webhook Integration**: Monitor PR merge events
- **Auto-Transition**: Move tickets to "Done" status when PRs are merged
- **Status Synchronization**: Keep Jira and GitHub states in sync

## 🏗️ Project Structure

```
forge-github-manage-panel/
├── src/
│   ├── frontend/
│   │   ├── components/
│   │   │   ├── ManageApiKey/      # Authentication component
│   │   │   ├── Repositories/      # Repository list and management
│   │   │   ├── PullRequest/       # PR display and actions
│   │   │   ├── Jira/             # Jira ticket integration
│   │   │   └── Utils/            # Shared utilities
│   │   └── index.jsx             # Main application entry
│   ├── resolvers/
│   │   └── index.js              # Backend API resolvers
│   ├── services/
│   │   ├── githubService.js      # GitHub API integration
│   │   └── jiraApi.js           # Jira API integration
│   └── index.js                 # Server entry point
├── manifest.yml                 # Forge app configuration
└── package.json                # Dependencies and scripts
```

## 🔧 Development Setup

### Environment Configuration

1. **Create environment file**:

   ```bash
   cp .env.example .env
   ```

2. **Configure Atlassian domain**:

   ```env
   DOMAIN=your-domain.atlassian.net
   ```

3. **Load environment variables**:
   ```bash
   source .env
   ```

### Required Environment Variables

Make sure your `.env` file contains:

```env
ENVIRONMENT=development
DOMAIN=your-domain.atlassian.net
```

### Handy Scripts

The `package.json` includes several convenient development scripts:

```json
{
  "scripts": {
    "forge:lint": "forge lint",
    "forge:deploy": "forge deploy",
    "forge:install": "forge install -e $ENVIRONMENT -s $DOMAIN -p Jira --confirm-scopes --non-interactive",
    "forge:uninstall": "forge uninstall -e $ENVIRONMENT -s $DOMAIN -p Jira",
    "forge:tunnel": "forge tunnel",
    "reinstall": "yarn forge:uninstall && yarn forge:deploy && yarn forge:install && yarn forge:tunnel"
  }
}
```

#### Script Descriptions

- **`yarn forge:lint`**: Check code quality using Forge linter
- **`yarn forge:deploy`**: Deploy app to Atlassian Cloud
- **`yarn forge:install`**: Install app on your Jira instance using environment variables
- **`yarn forge:uninstall`**: Remove app from your Jira instance
- **`yarn forge:tunnel`**: Start development tunnel for live testing
- **`yarn reinstall`**: Complete reinstall cycle - uninstall, deploy, install, and start tunnel

## 🧪 Testing Strategy

### Service Testing

- **GitHub Service**: API integration, error handling, authentication
- **Jira Service**: Ticket operations, status transitions, data parsing
- **Utility Functions**: Ticket key extraction, validation logic

### UI Component Testing

- **Authentication Flow**: Token storage and validation
- **Repository Display**: Data rendering and user interactions
- **PR Management**: Merge operations and status updates
- **Error Handling**: User feedback and error states

### Example Test Structure

```javascript
// services/__tests__/githubService.test.js
describe("GitHub Service", () => {
  test("should fetch repositories successfully", async () => {
    // Test implementation
  });

  test("should handle merge PR operations", async () => {
    // Test implementation
  });
});
```

## 🎨 UI Technology Stack

**Recommended**: Forge UI Kit for rapid development

- Pre-built components optimized for Atlassian products
- Consistent design language
- Reduced development time
- Built-in accessibility features

**Alternative**: Custom UI with Atlaskit components for advanced customization

## 📋 Development Notes

### Prerequisites

- Node.js 22+
- Forge CLI installed globally
- Valid Atlassian Cloud instance
- GitHub account with API access

### Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd forge-github-manage-panel
yarn install

# Configure environment
source .env

# Start development
yarn forge:tunnel
```

### Deployment

```bash
# Build and deploy
yarn forge:deploy
yarn forge:install
yarn forge:tunnel
```

### Full Development Cycle

```bash
# Complete reinstall and tunnel
yarn reinstall
```

---

**Note**: This is a demonstration application showcasing Forge capabilities. For production use, implement additional security measures, error handling, and testing coverage.
