import React, { useState, useEffect } from "react";
import {
  DynamicTable,
  Box,
  xcss,
  Heading,
  Stack,
  Button,
  Lozenge,
  Inline,
  Icon,
  Text,
} from "@forge/react";
import { invoke } from "@forge/bridge";
import { getTicketKeyFromBranchName } from "../../Utils";
import { JiraTicket } from "../../Jira/JiraTicket";

const containerStyle = xcss({
  marginTop: "space.200",
});

const errorBoxStyle = xcss({
  backgroundColor: "color.background.danger",
  padding: "space.100",
  borderRadius: "border.radius",
  border: "1px solid",
  borderColor: "color.border.danger",
});

const successBoxStyle = xcss({
  backgroundColor: "color.background.success",
  padding: "space.100",
  borderRadius: "border.radius",
  border: "1px solid",
  borderColor: "color.border.success",
});

const header = {
  cells: [
    { content: "Ticket", key: "ticket", isSortable: true },
    { content: "PR status", key: "status", isSortable: true },
    { content: "Title", key: "title", isSortable: true },
    { content: "Description", key: "description", isSortable: true },
    { content: "Created", key: "created_at", isSortable: true },
    { content: "Merge", key: "merge", isSortable: false },
  ],
};

export const PullRequestComponent = props => {
  const [pullRequests, setPullRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [mergeError, setMergeError] = useState(null);
  const [jiraTransitionPr, setJiraTransitionPr] = useState("");

  const handleBack = () => {
    if (props.onBack && typeof props.onBack === "function") {
      props.onBack();
    }
  };

  const getStatusAppearance = state => {
    switch (state) {
      case "open":
        return "success";
      case "closed":
        return "removed";
      case "merged":
        return "moved";
      default:
        return "default";
    }
  };

  const handleMerge = async pr => {
    // Clear previous messages
    setMergeError(null);
    setSuccessMessage(null);

    // Merge the pull request
    invoke("mergePullRequest", {
      pullNumber: pr.number,
      repoName: props.repoName,
      owner: props.owner,
    })
      .then(() => {
        setSuccessMessage("Pull request merged successfully!");
      })
      .catch(error => {
        setMergeError(
          `Failed to merge pull request: ${error?.message || error}`
        );
      });

    invoke("getPullRequests", {
      owner: props.owner,
      repoName: props.repoName,
    })
      .then(updatedPRs => {
        if (!updatedPRs) {
          setError("Failed to refresh pull request list after merge.");
          return;
        }
        setPullRequests(updatedPRs);
        setJiraTransitionPr(pr?.title);
      })
      .catch(() => {
        setError("Pull request merged, but failed to refresh list.");
      });
  };

  useEffect(() => {
    if (!props.owner || !props.repoName) {
      setError("Missing required repository information");
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);

    invoke("getPullRequests", { owner: props.owner, repoName: props.repoName })
      .then(prs => {
        setPullRequests(prs);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching pull requests:", error);
        setError(error.message || "Failed to fetch pull requests");
        setLoading(false);
      });
  }, [props.owner, props.repoName]);

  return (
    <Box xcss={containerStyle}>
      <Stack space="space.200">
        <Inline space="space.100" alignBlock="center">
          <Button appearance="subtle" onClick={handleBack}>
            <Icon glyph="arrow-left" label="Back" />
          </Button>
          <Heading level="h3">
            Pull Requests for {props.repoName || "Unknown Repository"}
          </Heading>
        </Inline>

        {error && (
          <Box xcss={errorBoxStyle}>
            <Text color="color.text.danger">Error: {error}</Text>
          </Box>
        )}

        {successMessage && (
          <Box xcss={successBoxStyle}>
            <Text color="color.text.success">{successMessage}</Text>
          </Box>
        )}

        {mergeError && (
          <Box xcss={errorBoxStyle}>
            <Text color="color.text.danger">{mergeError}</Text>
          </Box>
        )}

        {!error && (
          <DynamicTable
            head={header}
            rows={pullRequests.map(pr => ({
              cells: [
                {
                  content: (
                    <JiraTicket
                      branchName={pr?.title}
                      mergePr={jiraTransitionPr}
                      onMergeCallback={() => setJiraTransitionPr("")}
                    />
                  ),
                },
                {
                  content: (
                    <Lozenge appearance={getStatusAppearance(pr?.state)}>
                      {pr?.state || "No status"}
                    </Lozenge>
                  ),
                },
                { content: pr?.title || "No title" },
                { content: pr?.body?.slice(0, 100) || "No description" },
                { content: new Date(pr.created_at).toLocaleDateString() },
                {
                  content: (
                    <Button
                      appearance="primary"
                      onClick={() => handleMerge(pr)}
                    >
                      Merge
                    </Button>
                  ),
                },
              ],
            }))}
            isLoading={loading}
            emptyView="No pull requests found"
          />
        )}
      </Stack>
    </Box>
  );
};
