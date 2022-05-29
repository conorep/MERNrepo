import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppPages from "./AppPages";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// MSAL imports
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig, azureConfig } from "./authConfig";

import { AzureDevOpsApi } from "./azure-devops-api";
import { MsalProvider } from "@azure/msal-react";

export const azureConnection = new AzureDevOpsApi(azureConfig.organizationUrl, azureConfig.token);

// TODO: Example Function. Used to showcase how to use the custom Azure DevOps API
async function run() {
    const teams = await azureConnection.getTeams();
    console.log(teams);

    const projects = await azureConnection.getProjects();
    console.log(projects);

    if ((projects.count !== undefined && projects.count > 0) && (projects.count !== undefined && teams.count > 0)) {
        const workItems = await azureConnection.getWorkItemTasks(teams.value[0].projectId, teams.value[0].id);
        console.log(workItems);
    }

    const allWorkItems = await azureConnection.getAllWorkItems(teams.value[0].projectId, teams.value[0].id);
    console.log(allWorkItems);

    const listOfIds = allWorkItems.workItems.map(workItem => workItem.id);
    console.log("Array of IDs: " + listOfIds);


    const singleTicket = await azureConnection.getWorkItem(projects.value[1].id, allWorkItems.workItems[0].id);
    console.log(singleTicket);

    const ticketBatch = await azureConnection.getWorkItems(projects.value[1].id, listOfIds);
    console.log(ticketBatch);

    const teamMembers = await azureConnection.getTeamMembers(teams.value[1].projectId, teams.value[1].id);
    console.log(teamMembers);

    const allTeamMembers = await azureConnection.getAllTeamMembers(projects.value[1].id);
    console.log(allTeamMembers);

//    const getTickTypes = await azureConnection.getWorkItemTypes(projects.value[0].id);
//    console.log(getTickTypes);
//
//
//    const thisData = {"fields": {"System.State": "To Do", "System.Title": "A Ticket Title"}};
//
//    const createTicket = await azureConnection.createWorkItem(projects.value[0].id, "Task", thisData);
//    console.log(createTicket);
}
run();

export const msalInstance = new PublicClientApplication(msalConfig);

// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

// Optional - This will update account state if a user signs in from another tab or window
msalInstance.enableAccountStorageEvents();

msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
        const account = event.payload.account;
        msalInstance.setActiveAccount(account);
    }
});


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <MsalProvider instance={msalInstance}>
            <AppPages />
        </MsalProvider>
    </BrowserRouter>

);
