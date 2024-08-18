const {
  QueryClientImpl,
  QueryProvidersRequest,
} = require("@akashnetwork/akash-api/akash/provider/v1beta3");
const { getRpc } = require("@akashnetwork/akashjs/build/rpc");

const rpcEndpoint = "https://rpc.sandbox-01.aksh.pw:443"; // Replace with your actual RPC endpoint

async function listAllProviders() {
  try {
    const client = new QueryClientImpl(await getRpc(rpcEndpoint));

    const providersRequest = QueryProvidersRequest.fromPartial({
      pagination: {
        limit: 100, // Adjust as necessary
        countTotal: true,
      },
    });

    const providersResponse = await client.Providers(providersRequest);
    return providersResponse.providers; // Adjust based on the exact data structure returned
  } catch (error) {
    console.error("Error in listAllProviders:", error);
    throw error;
  }
}

module.exports = { listAllProviders };
