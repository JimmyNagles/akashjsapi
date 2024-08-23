const fs = require("fs");
const path = require("path");
const { DirectSecp256k1HdWallet, Registry } = require("@cosmjs/proto-signing");
const {
  certificateManager,
} = require("@akashnetwork/akashjs/build/certificates/certificate-manager");
const cert = require("@akashnetwork/akashjs/build/certificates");
const { SigningStargateClient } = require("@cosmjs/stargate");
const {
  getAkashTypeRegistry,
} = require("@akashnetwork/akashjs/build/stargate");

const rpcEndpoint =
  process.env.RPC_ENDPOINT || "https://rpc.sandbox-01.aksh.pw:443";

// Define the path where the certificate will be stored
const certificatePath = path.resolve(__dirname, "../certs/cert.json");

async function loadOrCreateCertificate(mnemonic) {
  console.log("Entering loadOrCreateCertificate");

  // Step 1: Create the wallet using the provided mnemonic
  console.log("Creating wallet with mnemonic:", mnemonic);

  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "akash",
  });

  console.log("Wallet created");

  // Step 2: Set up the Stargate client
  const registry = getAkashTypeRegistry();
  const client = await SigningStargateClient.connectWithSigner(
    rpcEndpoint,
    wallet,
    { registry: new Registry(registry) }
  );

  console.log("Stargate client set up");

  // Step 3: Check if the certificate exists or create a new one
  if (fs.existsSync(certificatePath)) {
    console.log("Certificate exists, loading it");
    return loadCertificate();
  }

  console.log("Certificate does not exist, creating new one");
  return createCertificate(wallet, client);
}

// Function to load an existing certificate from the file system
function loadCertificate() {
  console.log("Loading certificate from file");

  const json = fs.readFileSync(certificatePath, "utf8");

  try {
    const certificate = JSON.parse(json);
    console.log("Certificate loaded:", certificate);
    return certificate;
  } catch (e) {
    throw new Error(`Could not parse certificate: ${e}`);
  }
}

// Function to create a new certificate if one does not exist
async function createCertificate(wallet, client) {
  console.log("Creating new certificate");

  const accounts = await wallet.getAccounts();

  // Generate a new certificate PEM
  const certificate = certificateManager.generatePEM(accounts[0].address);

  // Broadcast the certificate to the network
  const result = await cert.broadcastCertificate(
    certificate,
    accounts[0].address,
    client
  );

  console.log("Broadcast result:", result);

  // If broadcast is successful, save the certificate locally
  if (result.code !== undefined && result.code === 0) {
    saveCertificate(certificate);
    return certificate;
  }

  // Handle failure in broadcasting certificate
  throw new Error(`Could not create certificate: ${result.rawLog}`);
}

// Function to save the certificate to the file system
function saveCertificate(certificate) {
  console.log("Saving certificate to file");

  const json = JSON.stringify(certificate);
  fs.writeFileSync(certificatePath, json);
  console.log("Certificate saved");
}

module.exports = { loadOrCreateCertificate };
