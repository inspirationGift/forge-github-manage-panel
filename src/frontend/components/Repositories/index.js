import React, { useEffect, useState } from "react";
import { Inline, Text, Heading, Stack, Box, xcss } from "@forge/react";
import { invoke } from "@forge/bridge";
import { Repository } from "./Repository";
import { RepositorySearchPanel } from "./RepositorySearchPanel";
import { PullRequestComponent } from "./PullRequest";

const repositoriesContainerStyle = xcss({
  minHeight: "800px",
  overflow: "auto",
});

export const Repositories = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isPullRequestComponent, setIsPullRequestComponent] = useState(false);
  const [pullRequestData, setPullRequestData] = useState({});

  const handleBackToRepositories = () => {
    setIsPullRequestComponent(false);
    setPullRequestData({});
    setSearchText("");
  };

  useEffect(() => {
    invoke("getRepositories")
      .then(repos => {
        setRepositories(repos);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching repositories:", error);
        setLoading(false);
      });
  }, []);

  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  if (loading) return <Text>Loading repositories...</Text>;

  function onRepositorySearch(selectedText) {
    setSearchText(selectedText);
  }

  const filteredRepositories = searchText
    ? repositories.filter(repo =>
        repo.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : repositories;

  const repoChunks = chunkArray(filteredRepositories, 3);

  const pullRequestCallback = (repoName, owner) => {
    setIsPullRequestComponent(true);
    setPullRequestData({ repoName, owner });
  };

  return (
    <Box xcss={repositoriesContainerStyle}>
      {!isPullRequestComponent && (
        <>
          <Heading level="2">Repositories</Heading>
          <RepositorySearchPanel onRepoSearch={onRepositorySearch} />
          <Stack space="space.200">
            {repoChunks.map((chunk, idx) => (
              <Inline
                space="space.200"
                alignBlock="baseline"
                key={"block_id_" + idx}
              >
                {chunk.map(repo => (
                  <Repository
                    key={repo.id}
                    repository={repo}
                    pullRequestCallback={pullRequestCallback}
                  />
                ))}
              </Inline>
            ))}
          </Stack>
        </>
      )}
      {isPullRequestComponent && (
        <PullRequestComponent
          repoName={pullRequestData.repoName}
          owner={pullRequestData.owner}
          onBack={handleBackToRepositories}
        />
      )}
    </Box>
  );
};
