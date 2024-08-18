const { SigningStargateClient } = require("@cosmjs/stargate");
const { DirectSecp256k1HdWallet, Registry } = require("@cosmjs/proto-signing");
const {
  MsgCreateLease,
} = require("@akashnetwork/akash-api/akash/market/v1beta4");
const {
  getAkashTypeRegistry,
} = require("@akashnetwork/akashjs/build/stargate");

const rpcEndpoint = "https://rpc.sandbox-01.aksh.pw:443";
const mnemonic =
  "cable attract dish spirit occur abuse cross guess drive advice result depart promote hood wait resource blade salt fun time whip dress party ribbon"; // Replace with actual mnemonic or keep as a placeholder

async function createLease(dseq, provider) {
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

    const lease = {
      bidId: {
        owner: account.address,
        dseq: dseq,
        gseq: "1",
        oseq: "1",
        provider: provider,
      },
    };

    const msg = {
      typeUrl: "/akash.market.v1beta4.MsgCreateLease",
      value: MsgCreateLease.fromPartial(lease),
    };

    const fee = {
      amount: [{ denom: "uakt", amount: "50000" }],
      gas: "2000000",
    };

    const result = await client.signAndBroadcast(
      account.address,
      [msg],
      fee,
      "create lease"
    );

    if (result.code !== 0) {
      throw new Error(`Failed to create lease: ${result.rawLog}`);
    }

    return { leaseId: lease.bidId, txHash: result.transactionHash };
  } catch (error) {
    console.error("Error in createLease:", error);
    throw error;
  }
}

module.exports = { createLease };
