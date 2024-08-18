const { DirectSecp256k1HdWallet, Registry } = require("@cosmjs/proto-signing");
const { SigningStargateClient } = require("@cosmjs/stargate");
const {
  MsgCloseDeployment,
} = require("@akashnetwork/akash-api/akash/deployment/v1beta3");
const {
  getAkashTypeRegistry,
  getTypeUrl,
} = require("@akashnetwork/akashjs/build/stargate");

const rpcEndpoint = "https://rpc.sandbox-01.aksh.pw:443";
const mnemonic =
  "cable attract dish spirit occur abuse cross guess drive advice result depart promote hood wait resource blade salt fun time whip dress party ribbon"; // Replace with actual mnemonic or keep as a placeholder

async function closeDeployment(dseq) {
  try {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: "akash",
    });
    const [account] = await wallet.getAccounts();

    const message = MsgCloseDeployment.fromPartial({
      id: {
        dseq: dseq, // Use the passed dseq argument here
        owner: account.address,
      },
    });

    const msgAny = {
      typeUrl: getTypeUrl(MsgCloseDeployment),
      value: message,
    };

    const myRegistry = new Registry(getAkashTypeRegistry());
    const client = await SigningStargateClient.connectWithSigner(
      rpcEndpoint,
      wallet,
      {
        registry: myRegistry,
      }
    );

    const fee = {
      amount: [
        {
          denom: "uakt",
          amount: "20000",
        },
      ],
      gas: "800000",
    };

    const result = await client.signAndBroadcast(
      account.address,
      [msgAny],
      fee,
      "take down deployment"
    );

    if (result.code !== 0) {
      throw new Error(`Failed to close deployment: ${result.rawLog}`);
    }

    return {
      message: "Deployment closed successfully",
      txHash: result.transactionHash,
    };
  } catch (error) {
    console.error("Error in closeDeployment:", error);
    throw error;
  }
}

module.exports = { closeDeployment };
