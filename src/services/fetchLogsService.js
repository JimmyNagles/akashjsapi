const WebSocket = require("ws");
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const {
  QueryClientImpl: QueryProviderClient,
  QueryProviderRequest,
} = require("@akashnetwork/akash-api/akash/provider/v1beta3");
const { getRpc } = require("@akashnetwork/akashjs/build/rpc");
const { loadOrCreateCertificate } = require("./certificateService");

const rpcEndpoint = "https://rpc.sandbox-01.aksh.pw:443";
const mnemonic =
  "cable attract dish spirit occur abuse cross guess drive advice result depart promote hood wait resource blade salt fun time whip dress party ribbon"; // Replace with actual mnemonic

async function fetchLogs(dseq, gseq, oseq, provider) {
  try {
    console.log(
      `Fetching logs for DSEQ: ${dseq}, GSEQ: ${gseq}, OSEQ: ${oseq}, Provider: ${provider}`
    );

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: "akash",
    });
    const [account] = await wallet.getAccounts();

    const rpc = await getRpc(rpcEndpoint);
    const client = new QueryProviderClient(rpc);

    const providerRequest = QueryProviderRequest.fromPartial({
      owner: provider,
    });
    const providerResponse = await client.Provider(providerRequest);

    if (!providerResponse.provider) {
      throw new Error(`Provider ${provider} not found.`);
    }

    const providerUri = providerResponse.provider.hostUri;
    const certificate = await loadOrCreateCertificate(mnemonic);

    const wsUrl = `wss://${
      new URL(providerUri).host
    }/lease/${dseq}/${gseq}/${oseq}/logs?follow=true&tail=100`;

    console.log(`Connecting to WebSocket: ${wsUrl}`);

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(wsUrl, {
        cert: certificate.cert,
        key: certificate.privateKey,
        rejectUnauthorized: false,
      });

      ws.on("open", () => {
        console.log("WebSocket connection established");
      });

      ws.on("message", (data) => {
        try {
          const logEntry = JSON.parse(data);
          console.log("Log entry:", logEntry);
          // Here you would process each log entry as it comes in
        } catch (error) {
          console.error("Error parsing log entry:", error);
        }
      });

      ws.on("close", () => {
        console.log("WebSocket connection closed");
        resolve({ message: "Log stream ended" });
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        reject(error);
      });
    });
  } catch (error) {
    console.error("Error in fetchLogs:", error);
    throw error;
  }
}

module.exports = { fetchLogs };
