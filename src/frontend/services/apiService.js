import { invoke } from '@forge/bridge';

/**
 * API Service - Centralized service for all backend resolver calls
 */
class ApiService {
  // API Key Management
  async saveApiKey(apiKey) {
    return await invoke('saveApiKey', { apiKey });
  }

  async isApiKeyAdded() {
    return await invoke('isApiKeyAdded');
  }

  async removeApiKey() {
    return await invoke('removeApiKey');
  }

  // GitHub Repository Management
  async getRepositories() {
    return await invoke('getRepositories');
  }

  async getPullRequests(owner, repoName) {
    return await invoke('getPullRequests', { owner, repoName });
  }

  async mergePullRequest(owner, repoName, pullNumber) {
    return await invoke('mergePullRequest', { owner, repoName, pullNumber });
  }

  // Jira Integration
  async getTicket(key) {
    return await invoke('getTicket', { key });
  }

  async transitionTicket(key) {
    return await invoke('transitionTicket', { key });
  }

}

export const apiService = new ApiService();