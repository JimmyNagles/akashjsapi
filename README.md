# Akash Deployment API Documentation

## Table of Contents
1. Introduction
2. Installation
3. Folder Structure
4. API Endpoints
   - a. Create a Deployment
   - b. List Bids for a Deployment
   - c. Create a Lease
   - d. Check Lease Status
   - e. Send Manifest
   - f. Close Deployment

## 1. Introduction

The Akash Deployment API facilitates the process of deploying, managing, and closing applications on the Akash Network. This API provides a series of endpoints that automate interactions with the Akash blockchain, allowing users to create deployments, bid on leases, send manifests, and more.

## 2. Installation

To set up the Akash Deployment API, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/akash-deployment-api.git
   cd akash-deployment-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Ensure you have the necessary certificates and credentials.
   - Place them in the `src/certs` directory.

4. Run the server:
   ```bash
   node src/server.js
   ```

The server will start running on `http://localhost:3005`.

## 3. Folder Structure

```
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
```

## 4. API Endpoints

### a. Create a Deployment

- **Endpoint:** `POST /api/deployments`
- **Description:** Creates a new deployment on the Akash network.
- **Request Body:**
  ```json
  {
    "dockerImage": "nginx:latest",
    "cpu": "0.5",
    "memory": "512Mi",
    "storage": "1Gi"
  }
  ```
- **Response:**
  ```json
  {
    "dseq": "6242229",
    "txHash": "FB238107FC7F54F021F87FF4C531F4D4AC2A7B11818297865431AFC21973136E"
  }
  ```

### b. List Bids for a Deployment

- **Endpoint:** `GET /api/deployments/:dseq/bids`
- **Description:** Lists bids for a given deployment sequence (dseq).
- **Response:** Array of bid objects

### c. Create a Lease

- **Endpoint:** `POST /api/deployments/:dseq/lease`
- **Description:** Creates a lease with a selected provider.
- **Request Body:**
  ```json
  {
    "provider": "akash1rk090a6mq9gvm0h6ljf8kz8mrxglwwxsk4srxh"
  }
  ```
- **Response:** Lease ID and transaction hash

### d. Check Lease Status

- **Endpoint:** `POST /api/deployments/lease-status`
- **Description:** Checks the status of a lease.
- **Request Body:**
  ```json
  {
    "owner": "akash1t69t39ma7mkmlu0larq4n8jpq42kdzwmlj8tua",
    "provider": "akash1rk090a6mq9gvm0h6ljf8kz8mrxglwwxsk4srxh",
    "dseq": "6242229",
    "gseq": 1,
    "oseq": 1
  }
  ```
- **Response:** Lease status and escrow payment information

### e. Send Manifest

- **Endpoint:** `POST /api/deployments/:dseq/manifest`
- **Description:** Sends a manifest to the provider.
- **Request Body:**
  ```json
  {
    "provider": "akash1rk090a6mq9gvm0h6ljf8kz8mrxglwwxsk4srxh",
    "dockerImage": "nginx:latest",
    "cpu": "0.5",
    "memory": "512Mi",
    "storage": "1Gi"
  }
  ```
- **Response:** Transaction hash and confirmation message

### f. Close Deployment

- **Endpoint:** `POST /api/deployments/close`
- **Description:** Closes a deployment.
- **Request Body:**
  ```json
  {
    "dseq": "6242229"
  }
  ```
- **Response:** Confirmation message and transaction hash
