const express = require("express");
const deploymentController = require("../controllers/deploymentController");

const router = express.Router();

router.post("/", deploymentController.createDeployment);
router.get("/:dseq/bids", deploymentController.listBids);
router.post("/:dseq/lease", deploymentController.createLease);
router.post("/:dseq/manifest", deploymentController.sendManifest);
router.post("/lease-status", deploymentController.checkLeaseStatus);
router.get("/providers", deploymentController.listAllProviders);
router.post("/close", deploymentController.closeDeployment);
router.post("/list-deployments", deploymentController.listDeployments);

module.exports = router;
