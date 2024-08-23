const express = require("express");
const deploymentController = require("../controllers/deploymentController");

const router = express.Router();

router.post("/", deploymentController.createDeployment);
router.get("/:dseq/bids", deploymentController.listBids);
router.post("/:dseq/lease", deploymentController.createLease);
router.post("/lease-status", deploymentController.checkLeaseStatus);

router.post("/:dseq/manifest", deploymentController.sendManifest);

router.post("/close", deploymentController.closeDeployment);

router.post("/list-deployments", deploymentController.listDeployments);
router.get("/providers", deploymentController.listAllProviders);
router.get("/provider/:address", deploymentController.getSingleProvider);

module.exports = router;
