import { fetch } from "@forge/api";
import { storage } from "@forge/api";

const getAuthHeaders = async () => {
  const token = await storage.getSecret("github-api-key");

  if (!token) {
    throw new Error("GitHub token not found");
  }

  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
};

export const getRepositories = async () => {
  const headers = await getAuthHeaders();

  const response = await fetch(`https://api.github.com/user/repos`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return await response.json();
};

export const getPullRequests = async (owner, repo) => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return await response.json();
};

export const mergePullRequest = async (owner, repo, pullNumber) => {
  const headers = await getAuthHeaders();

  // First check if the PR is mergeable
  const prResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`,
    { headers }
  );

  if (!prResponse.ok) {
    throw new Error(`Failed to get PR info: ${prResponse.status}`);
  }

  const prData = await prResponse.json();
  console.log("PR mergeable state:", prData.mergeable, "State:", prData.state);
  console.log("PR merge state status:", prData.mergeable_state);
  console.log("PR can merge:", prData.mergeable, "Draft:", prData.draft);

  if (prData.state !== "open") {
    throw new Error(`Pull request is ${prData.state}, cannot merge`);
  }

  if (prData.mergeable === false) {
    throw new Error("Pull request has conflicts and cannot be merged");
  }

  if (prData.draft) {
    throw new Error("Cannot merge draft pull request");
  }

  // Log the exact URL and payload being sent
  const mergeUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/merge`;
  const payload = {
    commit_title: `Merge pull request #${pullNumber}`,
    commit_message: `Merged via Forge GitHub management panel`,
    merge_method: "merge",
  };

  console.log("Merge URL:", mergeUrl);
  console.log("Merge payload:", payload);

  const response = await fetch(mergeUrl, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`GitHub API error ${response.status}:`, errorData);
    throw new Error(
      `GitHub API error: ${response.status} - ${
        errorData.message || "Unknown error"
      }`
    );
  }

  // return await response.json();
  const mergeResult = await response.json();
  return mergeResult;
};
