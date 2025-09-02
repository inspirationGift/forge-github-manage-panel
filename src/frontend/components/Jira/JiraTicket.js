import React, { useEffect, useState } from "react";
import { Text, Lozenge, Link, Inline } from "@forge/react";
import { apiService } from "../../services/apiService";
import { getTicketKeyFromBranchName } from "../Utils";

export const JiraTicket = ({ branchName, mergePr, onMergeCallback }) => {
  const [key, setKey] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const transitionTicket = async () => {
    if (!key || key === "No ticket") return;

    setTransitioning(true);
    try {
      await apiService.transitionTicket(key);
      console.log("Jira ticket transitioned successfully");
      // Refresh ticket data to get updated status
      getTicket().then(() => {
        if (onMergeCallback) {
          onMergeCallback();
        }
      });
    } catch (error) {
      console.error("Error transitioning Jira ticket:", error);
    } finally {
      setTransitioning(false);
    }
  };

  const getTicket = async () => {
    const issueKey = getTicketKeyFromBranchName(branchName);

    if (!issueKey || issueKey.trim().length === 0) {
      setKey("No ticket");
      return;
    }

    setLoading(true);
    try {
      const ticket = await apiService.getTicket(issueKey);
      setKey(ticket.key);
      setStatus(ticket?.fields?.status?.name || "Unknown");
    } catch (error) {
      console.error("Error fetching Jira ticket:", error);
      setKey("No ticket");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  // Handle merge trigger from parent
  useEffect(() => {
    if (mergePr && mergePr === branchName && key && key !== "No ticket") {
      const handleTransition = async () => {
        try {
          await transitionTicket();
          await getTicket();
          if (onMergeCallback) {
            onMergeCallback();
          }
        } catch (error) {
          console.error("Error in merge transition:", error);
        }
      };
      handleTransition();
    }
  }, [mergePr, branchName, key]);

  useEffect(() => {
    getTicket();
  }, [branchName]);

  if (loading || transitioning) {
    return <Text>{loading ? "Loading..." : "Transitioning..."}</Text>;
  }

  if (key === "No ticket") {
    return <Text>No ticket</Text>;
  }

  return (
    <Inline space="space.100" alignItems="center">
      {status && <Lozenge appearance="inprogress">{status}</Lozenge>}
      <Link href={`/browse/${key}`}>{key.toUpperCase()}</Link>
    </Inline>
  );
};
