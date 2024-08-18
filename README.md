Akash Deployment API
This API facilitates the process of deploying, managing, and closing applications on the Akash Network. It provides a series of endpoints that automate interactions with the Akash blockchain, allowing users to create deployments, bid on leases, send manifests, and more.

Folder Structure
go
Copy code
├── README.md
├── package-lock.json
├── package.json
└── src
    ├── certs
    │   └── akash1t69t39ma7mkmlu0larq4n8jpq42kdzwmlj8tua.cert.json
    ├── controllers
    │   └── deploymentController.js
    ├── routes
    │   └── deploymentRoutes.js
    ├── server.js
    ├── services
    │   ├── bidsService.js
    │   ├── closeDeploymentService.js
    │   ├── deploymentService.js
    │   ├── leaseService.js
    │   ├── leaseStatusService.js
    │   ├── listAllProvidersService.js
    │   ├── listDeploymentsService.js
    │   └── manifestService.js
    └── utils
        └── sdlGenerator.js
Installation Instructions
Clone the Repository

bash
Copy code
git clone https://github.com/your-repo/akash-deployment-api.git
cd akash-deployment-api
Install Dependencies

bash
Copy code
npm install
Set Up Environment Variables

Ensure you have the necessary certificates and credentials.
Place them in the src/certs directory.
Run the Server

bash
Copy code
node src/server.js
The server will start running on http://localhost:3005.

Usage Guide
1. Create a Deployment
Endpoint: POST /api/deployments
Description: Creates a new deployment on the Akash network.
Request:
bash
Copy code
curl -X POST http://localhost:3005/api/deployments \
-H "Content-Type: application/json" \
-d '{
  "dockerImage": "nginx:latest",
  "cpu": "0.5",
  "memory": "512Mi",
  "storage": "1Gi"
}'
Response:
json
Copy code
{
  "dseq": "6242229",
  "txHash": "FB238107FC7F54F021F87FF4C531F4D4AC2A7B11818297865431AFC21973136E"
}
2. List Bids for a Deployment
Endpoint: GET /api/deployments/:dseq/bids
Description: Lists bids for a given deployment sequence (dseq).
Request:
bash
Copy code
curl http://localhost:3005/api/deployments/6242229/bids
Response:
json
Copy code
[
  {
    "$type": "akash.market.v1beta4.QueryBidResponse",
    "bid": {
      "$type": "akash.market.v1beta4.Bid",
      "bidId": {
        "owner": "akash1t69t39ma7mkmlu0larq4n8jpq42kdzwmlj8tua",
        "dseq": { "low": 6242229, "high": 0, "unsigned": true },
        "gseq": 1,
        "oseq": 1,
        "provider": "akash1rk090a6mq9gvm0h6ljf8kz8mrxglwwxsk4srxh"
      },
      "state": 1,
      "price": { "denom": "uakt", "amount": "1.16891600000000007" }
    }
  }
]
3. Create a Lease
Endpoint: POST /api/deployments/:dseq/lease
Description: Creates a lease with a selected provider.
Request:
bash
Copy code
curl -X POST http://localhost:3005/api/deployments/6242229/lease \
-H "Content-Type: application/json" \
-d '{"provider": "akash1rk090a6mq9gvm0h6ljf8kz8mrxglwwxsk4srxh"}'
Response:
json
Copy code
{
  "leaseId": {
    "owner": "akash1t69t39ma7mkmlu0larq4n8jpq42kdzwmlj8tua",
    "dseq": "6242229",
    "gseq": "1",
    "oseq": "1",
    "provider": "akash1rk090a6mq9gvm0h6ljf8kz8mrxglwwxsk4srxh"
  },
  "txHash": "63C44509AB40181E1D236B7B07D291B7E56F8E68E7F9EE040DE7A763E82FF7C3"
}
4. Check Lease Status
Endpoint: POST /api/deployments/lease-status
Description: Checks the status of a lease.
Request:
bash
Copy code
curl -X POST http://localhost:3005/api/deployments/lease-status \
-H "Content-Type: application/json" \
-d '{
  "owner": "akash1t69t39ma7mkmlu0larq4n8jpq42kdzwmlj8tua",
  "provider": "akash1rk090a6mq9gvm0h6ljf8kz8mrxglwwxsk4srxh",
  "dseq": "6242229",
  "gseq": 1,
  "oseq": 1
}'
Response:
json
Copy code
{
  "lease": {
    "leaseId": {
      "owner": "akash1t69t39ma7mkmlu0larq4n8jpq42kdzwmlj8tua",
      "dseq": "6242229",
      "gseq": 1,
      "oseq": 1,
      "provider": "akash1rk090a6mq9gvm0h6ljf8kz8mrxglwwxsk4srxh"
    },
    "state": "active",
    "price": { "denom": "uakt", "amount": "1.16891600000000007" },
    "createdAt": "6242277"
  },
  "escrowPayment": {
    "accountId": {
      "scope": "deployment",
      "xid": "akash1t69t39ma7mkmlu0larq4n8jpq42kdzwmlj8tua/6242229"
    },
    "state": "open"
  }
}
5. Send Manifest
Endpoint: POST /api/deployments/:dseq/manifest
Description: Sends a manifest to the provider.
Request:
bash
Copy code
curl -X POST http://localhost:3005/api/deployments/6242229/manifest \
-H "Content-Type: application/json" \
-d '{
  "provider": "akash1rk090a6mq9gvm0h6ljf8kz8mrxglwwxsk4srxh",
  "dockerImage": "nginx:latest",
  "cpu": "0.5",
  "memory": "512Mi",
  "storage": "1Gi"
}'
Response:
json
Copy code
{
  "txHash": "63C44509AB40181E1D236B7B07D291B7E56F8E68E7F9EE040DE7A763E82FF7C3",
  "manifest": "Manifest successfully sent."
}
6. Close Deployment
Endpoint: POST /api/deployments/close
Description: Closes a deployment.
Request:
bash
Copy code
curl -X POST http://localhost:3005/api/deployments/close \
-H "Content-Type: application/json" \
-d '{
  "dseq": "6242229"
}'
Response:
json
Copy code
{
  "message": "Deployment closed successfully",
  "txHash": "BA770F2ACE557BA047DFA7541843A78D7D5AE0C5770A2C09F256773E6183155B"
}
