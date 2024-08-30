const { createDeployment } = require("../services/deploymentService");
const { listBids } = require("../services/bidsService");
const { createLease } = require("../services/leaseService");
const { getLeaseStatus } = require("../services/leaseStatusService");
const { sendManifest } = require("../services/manifestService");
const { listAllProviders } = require("../services/listAllProvidersService");
const { closeDeployment } = require("../services/closeDeploymentService");
const { listDeployments } = require("../services/listDeploymentsService");
const { getSingleProviderInfo } = require("../services/singleProviderService");
const { fetchLogs } = require("../services/fetchLogsService");

exports.listDeployments = async (req, res) => {
  try {
    const { owner } = req.body;
    const deployments = await listDeployments(owner);
    res.status(200).json(deployments);
  } catch (error) {
    console.error("Error in listDeployments controller:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createDeployment = async (req, res) => {
  try {
    const { dockerImage, cpu, memory, storage } = req.body;
    const result = await createDeployment(dockerImage, cpu, memory, storage);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in createDeployment controller:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.closeDeployment = async (req, res) => {
  try {
    const { dseq } = req.body;
    const result = await closeDeployment(dseq);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in closeDeployment controller:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.listBids = async (req, res) => {
  try {
    const { dseq } = req.params;
    const bids = await listBids(dseq);
    res.json(bids);
  } catch (error) {
    console.error("Error in listBids controller:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createLease = async (req, res) => {
  try {
    const { dseq } = req.params;
    const { provider } = req.body;
    const result = await createLease(dseq, provider);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in createLease controller:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.checkLeaseStatus = async (req, res) => {
  try {
    const { owner, provider, dseq, gseq, oseq } = req.body;
    const leaseId = { owner, provider, dseq, gseq, oseq };
    const status = await getLeaseStatus(leaseId);
    res.status(200).json(status);
  } catch (error) {
    console.error("Error in checkLeaseStatus controller:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getLogs = async (req, res) => {
  const { dseq } = req.params;
  const { gseq, oseq, provider } = req.query;

  try {
    const logs = await fetchLogs(dseq, gseq, oseq, provider);
    res.json(logs);
  } catch (error) {
    console.error("Error in getLogs controller:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.sendManifest = async (req, res) => {
  try {
    const { dseq } = req.params;
    const { provider, dockerImage, cpu, memory, storage } = req.body;
    const result = await sendManifest(
      dseq,
      provider,
      dockerImage,
      cpu,
      memory,
      storage
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in sendManifest controller:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.listAllProviders = async (req, res) => {
  try {
    const providers = await listAllProviders();
    res.status(200).json(providers);
  } catch (error) {
    console.error("Error in listAllProviders controller:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getSingleProvider = async (req, res) => {
  try {
    const { address } = req.params;
    const providerInfo = await getSingleProviderInfo(address);
    res.status(200).json(providerInfo);
  } catch (error) {
    console.error("Error in getSingleProvider controller:", error);
    res.status(500).json({ error: error.message });
  }
};
