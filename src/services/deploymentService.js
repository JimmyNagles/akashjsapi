const { SigningStargateClient } = require("@cosmjs/stargate");
const { DirectSecp256k1HdWallet, Registry } = require("@cosmjs/proto-signing");
const {
  MsgCreateDeployment,
} = require("@akashnetwork/akash-api/akash/deployment/v1beta3");
const {
  getAkashTypeRegistry,
} = require("@akashnetwork/akashjs/build/stargate");
const { SDL } = require("@akashnetwork/akashjs/build/sdl"); // <-- Add this line
const { generateSDL } = require("../utils/sdlGenerator"); // Ensure this utility exists

const rpcEndpoint =
  process.env.RPC_ENDPOINT || "https://rpc.sandbox-01.aksh.pw:443";
const mnemonic =
  "cable attract dish spirit occur abuse cross guess drive advice result depart promote hood wait resource blade salt fun time whip dress party ribbon"; // Replace with actual mnemonic or keep as a placeholder

async function createDeployment(dockerImage, cpu, memory, storage) {
  try {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: "akash",
    });
    const [account] = await wallet.getAccounts();

    const registry = getAkashTypeRegistry();
    const client = await SigningStargateClient.connectWithSigner(
      rpcEndpoint,
      wallet,
      { registry: new Registry(registry) }
    );

    const sdl = generateSDL(dockerImage, cpu, memory, storage);
    const sdlInstance = SDL.fromString(sdl, "beta3");
    const groups = sdlInstance.groups();

    const blockHeight = await client.getHeight();

    const deployment = {
      id: { owner: account.address, dseq: blockHeight.toString() },
      groups,
      version: await sdlInstance.manifestVersion(),
      deposit: { denom: "uakt", amount: "5000000" },
      depositor: account.address,
    };

    const msg = {
      typeUrl: "/akash.deployment.v1beta3.MsgCreateDeployment",
      value: MsgCreateDeployment.fromPartial(deployment),
    };
    const fee = { amount: [{ denom: "uakt", amount: "20000" }], gas: "800000" };

    const result = await client.signAndBroadcast(
      account.address,
      [msg],
      fee,
      "create deployment"
    );

    if (result.code !== 0) {
      throw new Error(`Failed to create deployment: ${result.rawLog}`);
    }

    return { dseq: deployment.id.dseq, txHash: result.transactionHash };
  } catch (error) {
    console.error("Error in createDeployment:", error);
    throw error;
  }
}

module.exports = { createDeployment };
