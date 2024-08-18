const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const {
  QueryClientImpl: QueryMarketClient,
  QueryBidsRequest,
} = require("@akashnetwork/akash-api/akash/market/v1beta4");
const { getRpc } = require("@akashnetwork/akashjs/build/rpc");

const rpcEndpoint =
  process.env.RPC_ENDPOINT || "https://rpc.sandbox-01.aksh.pw:443";
const mnemonic =
  "cable attract dish spirit occur abuse cross guess drive advice result depart promote hood wait resource blade salt fun time whip dress party ribbon"; // Replace with actual mnemonic or keep as a placeholder

async function listBids(dseq) {
  try {
    const rpc = await getRpc(rpcEndpoint);
    const client = new QueryMarketClient(rpc);
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: "akash",
    });
    const [account] = await wallet.getAccounts();

    const request = QueryBidsRequest.fromPartial({
      filters: {
        owner: account.address,
        dseq: dseq,
      },
    });

    const response = await client.Bids(request);
    return response.bids;
  } catch (error) {
    console.error("Error in listBids:", error);
    throw error;
  }
}

module.exports = { listBids };
