import Resolver from "@forge/resolver";
import { storage } from "@forge/api";

const resolver = new Resolver();

resolver.define("getText", req => {
  console.log(req);
  return "Hello, world!";
});

resolver.define("saveApiKey", async req => {
  const { apiKey } = req.payload;
  await storage.setSecret("github-api-key", apiKey);
  return { success: true };
});

resolver.define("getApiKey", async () => {
  const apiKey = await storage.getSecret("github-api-key");
  return { apiKey };
});

resolver.define("isApiKeyAdded", async () => {
  const apiKey = await storage.getSecret("github-api-key");
  return { isApiKeyAdded: !!apiKey };
});

resolver.define("removeApiKey", async () => {
  await storage.deleteSecret("github-api-key");
  return { success: true };
});

resolver.define("getRepositories", async req => {
  const { getRepositories } = await import("../services/githubService.js");
  return await getRepositories();
});

resolver.define("getPullRequests", async req => {
  const { owner, repoName } = req.payload;

  if (!owner || !repoName) {
    throw new Error(
      `Missing required parameters. Owner: ${owner}, RepoName: ${repoName}`
    );
  }

  const { getPullRequests } = await import("../services/githubService.js");
  return await getPullRequests(owner, repoName);
});

resolver.define("mergePullRequest", async req => {
  const { owner, repoName, pullNumber } = req.payload;

  if (!owner || !repoName || !pullNumber) {
    throw new Error(
      `Missing required parameters. Owner: ${owner}, RepoName: ${repoName}, PullNumber: ${pullNumber}`
    );
  }

  const { mergePullRequest } = await import("../services/githubService.js");
  return await mergePullRequest(owner, repoName, pullNumber);
});

resolver.define("getTicket", async req => {
  const { key } = req.payload;
  console.log("Fetching Jira ticket with key:", key);

  if (!key) {
    throw new Error("Missing required parameter: key");
  }
  const { getTicket } = await import("../services/jiraApi.js");
  return await getTicket(key);
});

resolver.define("transitionTicket", async req => {
  const { key } = req.payload;
  console.log("Transitioning Jira ticket with key:", key);

  if (!key) {
    throw new Error("Missing required parameter: key");
  }

  const { transitionTicket } = await import("../services/jiraApi.js");
  return await transitionTicket(key);
});

export const handler = resolver.getDefinitions();
