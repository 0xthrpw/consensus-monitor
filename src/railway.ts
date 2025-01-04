import { env } from "#/env.ts";

interface DeploymentsResponse {
    data: {
        deployments: {
            edges: {
                node: {
                    id: string;
                };
            }[];
        };
    };
}

export async function executeQuery(query: string): Promise<string> {
    const result = await fetch('https://backboard.railway.com/graphql/v2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.RAILWAY_API_TOKEN}`
        },
        body: JSON.stringify({
            query
        })
    })
    const response = await result.json()
    console.log(response)
    return response
}


export async function updateVariable(field: string, newValue: string, serviceID: string, envID: string): Promise<void> {
    const query = `mutation variableUpsert {
        variableUpsert(
            input: {
                projectId: "${env.RAILWAY_PROJECT_ID}"
                environmentId: "${envID}"
                serviceId: "${serviceID}"
                name: "${field}"
                value: "${newValue}"
            }
        )
    }`
    await executeQuery(query)
}

export async function getDeploymentID(serviceID: string, envID: string): Promise<string> {
    const query = `query deployments {
        deployments(
            first: 1
            input: {projectId: "${env.RAILWAY_PROJECT_ID}", environmentId: "${envID}", serviceId: "${serviceID}"}
        ) {
            edges {
                node {
                    id
                }
            }
        }
    }`
    const response = await executeQuery(query) as unknown as DeploymentsResponse
    return response.data.deployments.edges[0].node.id
}

export async function redeployService(deploymentID: string): Promise<void> {
    const query = `mutation deploymentRestart {
        deploymentRedeploy(id: "${deploymentID}") {
            service {
                name
                id
            }
        }
    }`
    await executeQuery(query)
}