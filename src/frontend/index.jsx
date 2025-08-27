import React, { useEffect, useState } from "react";
import ForgeReconciler, {
  Text,
  Heading,
  Button,
  Inline,
  Stack,
  Box,
} from "@forge/react";
import { invoke } from "@forge/bridge";
import { Repositories } from "./components/Repositories";
import { ManageApiKey } from "./components/ManageApiKey";

const App = () => {
  const [isApiKeyAdded, setIsApiKeyAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    invoke("isApiKeyAdded").then(result => {
      setIsApiKeyAdded(result.isApiKeyAdded);
      setIsLoading(false);
    });
  }, []);

  function handleSaveToken() {
    setIsApiKeyAdded(true);
  }

  function handleRemoveToken() {
    invoke("removeApiKey").then(() => setIsApiKeyAdded(false));
  }

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <>
      {isApiKeyAdded ? (
        <>
          <Box>
            <Inline alignInline="end">
              <Button appearance="primary" onClick={handleRemoveToken}>
                Delete Api Key
              </Button>
            </Inline>
          </Box>
          <Box>
            <Repositories />
          </Box>
        </>
      ) : (
        <ManageApiKey onSuccess={handleSaveToken} />
      )}
    </>
  );
};
ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
