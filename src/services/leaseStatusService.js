const {
  QueryClientImpl,
  QueryLeaseRequest,
  QueryLeaseResponse,
} = require("@akashnetwork/akash-api/akash/market/v1beta4");
const { getRpc } = require("@akashnetwork/akashjs/build/rpc");

const rpcEndpoint = "https://rpc.sandbox-01.aksh.pw:443"; // Use your actual RPC endpoint

async function getLeaseStatus(leaseId) {
  try {
    const rpc = await getRpc(rpcEndpoint);
    const client = new QueryClientImpl(rpc);

    const getLeaseStatusRequest = QueryLeaseRequest.fromPartial({
      id: {
        owner: leaseId.owner,
        provider: leaseId.provider,
        dseq: leaseId.dseq,
        gseq: leaseId.gseq,
        oseq: leaseId.oseq,
      },
    });

    const leaseStatusResponse = await client.Lease(getLeaseStatusRequest);
    const data = QueryLeaseResponse.toJSON(leaseStatusResponse);

    return data;
  } catch (error) {
    console.error("Error in getLeaseStatus:", error);
    throw error;
  }
}

module.exports = { getLeaseStatus };
