import {
  Box,
  Icon,
  Inline,
  Lozenge,
  Strong,
  Text,
  xcss,
  Button,
} from "@forge/react";
import React from "react";

const cardStyle = xcss({
  backgroundColor: "elevation.surface.raised",
  boxShadow: "elevation.shadow.raised",
  padding: "space.200",
  borderRadius: "border.radius",
  borderBlockColor: "color.border.accent.gray",
  width: "500px",
  height: "300px",
  cursor: "pointer",
});

export const Repository = ({ repository, pullRequestCallback }) => {
  const handlePullRequestClick = () => {
    if (pullRequestCallback && typeof pullRequestCallback === "function") {
      pullRequestCallback(repository.name, repository.owner.login);
    } else {
      console.log("Repository clicked:", repository.name);
    }
  };

  return (
    <>
      <Box
        key={repository.key}
        xcss={cardStyle}
        onClick={handlePullRequestClick}
      >
        <Text>Name: {repository.name}</Text>
        <Box>
          <Lozenge appearance="inprogress">
            {repository?.private ? "Private" : "Public"}
          </Lozenge>
        </Box>
        <Box>
          <Text>Description: {repository?.description}</Text>
        </Box>
        <Box>
          <Text>
            Created:{" "}
            {repository?.created_at
              ? new Date(repository.created_at).toLocaleDateString()
              : "N/A"}
          </Text>
        </Box>
        <Box>
          <Text>
            Updated:{" "}
            {repository?.updated_at
              ? new Date(repository.updated_at).toLocaleDateString()
              : "N/A"}
          </Text>
        </Box>
        <Inline alignBlock="center" space="space.050">
          <Button appearance="primary" onClick={handlePullRequestClick}>
            Details
          </Button>
        </Inline>
      </Box>
    </>
  );
};
