import api, { route } from "@forge/api";

export const getTicket = async key => {
  try {
    const response = await api
      .asUser()
      .requestJira(route`/rest/api/3/issue/${key}`, {
        headers: {
          Accept: "application/json",
        },
      });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jira API error: ${response.status} - ${errorText}`);
      throw new Error(`Jira API error: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in getTicket:", error);
    throw error;
  }
};

export const transitionTicket = async key => {
  try {
    console.log(`Transitioning Jira ticket: ${key}`);

    const bodyData = JSON.stringify({
      transition: {
        id: "9026", // ID for "Done" transition
      },
    });

    const response = await api
      .asUser()
      .requestJira(route`/rest/api/3/issue/${key}/transitions`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: bodyData,
      });

    if (!response.ok) {
      console.error(`Jira API error: ${response.status} - ${errorText}`);
      throw new Error(`Jira API error: ${response.status}`);
    }

    return;
  } catch (error) {
    console.error("Error in transition ticket:", error);
    throw error;
  }
};
