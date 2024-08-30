const {
  QueryDeploymentsRequest,
  QueryClientImpl,
} = require("@akashnetwork/akash-api/akash/deployment/v1beta3");
const { getRpc } = require("@akashnetwork/akashjs/build/rpc");

const rpcEndpoint = "https://rpc.sandbox-01.aksh.pw:443"; // Replace with your actual RPC endpoint

async function listDeployments(owner) {
  console.log("Owner:", owner);
  try {
    const client = new QueryClientImpl(await getRpc(rpcEndpoint));

    const request = QueryDeploymentsRequest.fromPartial({
      filters: {
        owner: owner,
      },
    });

    const response = await client.Deployments(request);

    // Return the full deployment objects
    return response.deployments.map((deployment) => ({
      deployment: deployment.deployment,
      groups: deployment.groups,
      escrowAccount: deployment.escrowAccount,
    }));
  } catch (error) {
    console.error("Error in listDeployments:", error);
    throw error;
  }
}

module.exports = { listDeployments };
