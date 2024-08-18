# Akash Deployment API Documentation

## Table of Contents
1. Introduction
2. Installation
3. Folder Structure
4. Usage Guide
   - a. Create a Deployment
   - b. List Bids for a Deployment
   - c. Create a Lease
   - d. Check Lease Status
   - e. Send Manifest
   - f. Close Deployment

## 1. Introduction

The Akash Deployment API facilitates the process of deploying, managing, and closing applications on the Akash Network. It provides a series of endpoints that automate interactions with the Akash blockchain, allowing users to create deployments, bid on leases, send manifests, and more.

## 2. Installation

To set up the Akash Deployment API, follow these steps:


2. Install Dependencies:
   ```bash
   npm install
   ```

3. Set Up Environment Variables:
   - Ensure you have the necessary certificates and credentials.
   - Place them in the `src/certs` directory.

4. Run the Server:
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

## 4. Usage Guide

### a. Create a Deployment

- **Endpoint:** `POST /api/deployments`
- **Description:** Creates a new deployment on the Akash network.
- **Request:**
  ```bash
  curl -X POST http://localhost:3005/api/deployments \
  -H "Content-Type: application/json" \
  -d '{
    "dockerImage": "nginx:latest",
    "cpu": "0.5",
    "memory": "512Mi",
    "storage": "1Gi"
  }'
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
- **Request:**
  ```bash
  curl http://localhost:3005/api/deployments/6242229/bids
  ```
- **Response:**
  ```json
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
  ```

### c. Create a Lease

- **Endpoint:** `POST /api/deployments/:dseq/lease`
- **Description:** Creates a lease with a selected provider.
- **Request:**
  ```bash
  curl -X POST http://localhost:3005/api/deployments/6242229/lease \
  -H "Content-Type: application/json" \
  -d '{"provider": "akash1rk090a6mq9gvm0h6ljf8kz8mrxglwwxsk4srxh"}'
  ```
- **Response:**
  ```json
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
  ```

### d. Check Lease Status

- **Endpoint:** `POST /api/deployments/lease-status`
- **Description:** Checks the status of a lease.
- **Request:**
  ```bash
  curl -X POST http://localhost:3005/api/deployments/lease-status \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "akash1t69t39ma7mkmlu0larq4n8jpq42kdzwmlj8tua",
    "provider": "akash1rk090a6mq9gvm0h6ljf8kz8mrxglwwxsk4srxh",
    "dseq": "6242229",
    "gseq": 1,
    "oseq": 1
  }'
  ```
- **Response:**
  ```json
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
  ```

### e. Send Manifest

- **Endpoint:** `POST /api/deployments/:dseq/manifest`
- **Description:** Sends a manifest to the provider.
- **Request:**
  ```bash
  curl -X POST http://localhost:3005/api/deployments/6242229/manifest \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "akash1rk090a6mq9gvm0h6ljf8kz8mrxglwwxsk4srxh",
    "dockerImage": "nginx:latest",
    "cpu": "0.5",
    "memory": "512Mi",
    "storage": "1Gi"
  }'
  ```
- **Response:**
  ```json
  {
    "txHash": "63C44509AB40181E1D236B7B07D291B7E56F8E68E7F9EE040DE7A763E82FF7C3",
    "manifest": "Manifest successfully sent."
  }
  ```

### f. Close Deployment

- **Endpoint:** `POST /api/deployments/close`
- **Description:** Closes a deployment.
- **Request:**
  ```bash
  curl -X POST http://localhost:3005/api/deployments/close \
  -H "Content-Type: application/json" \
  -d '{
    "dseq": "6242229"
  }'
  ```
- **Response:**
  ```json
  {
    "message": "Deployment closed successfully",
    "txHash": "BA770F2ACE557BA047DFA7541843A78D7D5AE0C5770A2C09F256773E6183155B"
  }
  ```
