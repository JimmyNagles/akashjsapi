const {
  QueryClientImpl,
} = require("@akashnetwork/akash-api/akash/provider/v1beta3");
const { getRpc } = require("@akashnetwork/akashjs/build/rpc");

async function getSingleProviderInfo(providerAddress) {
  try {
    const client = new QueryClientImpl(
      await getRpc("https://rpc.sandbox-01.aksh.pw:443")
    );
    const getProviderInfoRequest = {
      owner: providerAddress,
    };
    const providerResponse = await client.Provider(getProviderInfoRequest);

    console.log(providerResponse);
    return providerResponse;
  } catch (error) {
    console.error("Error in getSingleProviderInfo:", error);
    throw error;
  }
}

module.exports = { getSingleProviderInfo };
