const https = require("https");
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const {
  QueryClientImpl: QueryProviderClient,
  QueryProviderRequest,
} = require("@akashnetwork/akash-api/akash/provider/v1beta3");
const { getRpc } = require("@akashnetwork/akashjs/build/rpc");
const { SDL } = require("@akashnetwork/akashjs/build/sdl");
const { loadOrCreateCertificate } = require("./certificateService"); // Import your certificate service
const { generateSDL } = require("../utils/sdlGenerator");

const rpcEndpoint = "https://rpc.sandbox-01.aksh.pw:443";
const mnemonic =
  "cable attract dish spirit occur abuse cross guess drive advice result depart promote hood wait resource blade salt fun time whip dress party ribbon"; // Replace with actual mnemonic or keep as a placeholder

async function sendManifest(dseq, provider, dockerImage, cpu, memory, storage) {
  try {
    console.log(`Sending manifest for DSEQ: ${dseq}, Provider: ${provider}`);

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

    const providerInfo = providerResponse.provider;

    // Use the certificate service to load or create the certificate
    const certificate = await loadOrCreateCertificate(mnemonic);

    const sdl = generateSDL(dockerImage, cpu, memory, storage);
    const manifest = SDL.fromString(sdl, "beta3").manifestSortedJSON();

    const uri = new URL(providerInfo.hostUri);
    const path = `/deployment/${dseq}/manifest`;

    console.log(`Sending manifest to: ${uri.hostname}${path}`);

    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: uri.hostname,
          port: uri.port,
          path,
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Content-Length": Buffer.byteLength(manifest),
          },
          cert: certificate.cert,
          key: certificate.privateKey,
          rejectUnauthorized: false, // Disable SSL verification
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            console.log(`Response status: ${res.statusCode}`);
            console.log(`Response data: ${data}`);
            if (res.statusCode === 200) {
              resolve({ message: "Manifest sent successfully", result: data });
            } else {
              reject(
                new Error(`Failed to send manifest: ${res.statusCode}, ${data}`)
              );
            }
          });
        }
      );

      req.on("error", (error) => {
        console.error("Request error:", error);
        reject(error);
      });

      req.write(manifest);
      req.end();
    });
  } catch (error) {
    console.error("Error in sendManifest:", error);
    throw error;
  }
}

module.exports = { sendManifest };
