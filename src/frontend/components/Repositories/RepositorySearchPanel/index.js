import { Textfield, Box, xcss } from "@forge/react";
import React from "react";

const searchPanelStyle = xcss({
  margin: "space.200",
});

export const RepositorySearchPanel = ({ onRepoSearch }) => {
  return (
    <Box xcss={searchPanelStyle}>
      <Textfield onChange={e => onRepoSearch(e.target.value)} />
    </Box>
  );
};
