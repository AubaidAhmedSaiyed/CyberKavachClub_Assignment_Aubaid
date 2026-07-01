# CyberKavach Specmatic Implementation

This repository showcases the implementation of **Specmatic Contract Testing** and **Schema Resiliency Testing** on a Node.js/Express backend.

## 🚀 Getting Started

### 1. Installation
Ensure you have Node.js installed, then install the dependencies for both the server and the project root (if applicable):

```bash
cd server
npm install
```

### 2. Environment Variables
Ensure you have a `.env` file in the `server` directory with your MongoDB connection string and JWT secret.
Example `.env`:
```
PORT=5000
DATABASE_URL=mongodb+srv://...
JWT_SECRET=your_secret_here
```

### 3. Running the Server
You must have the backend server running locally for the automated tests to hit the API endpoints.

```bash
cd server
npm run dev
```

The server should start on `http://localhost:5000`.

---

## 🧪 Testing with Specmatic

This project uses [Specmatic](https://specmatic.in/) to validate the API against the OpenAPI specification (`server/spec.yaml`). It includes external examples for every documented endpoint.

### 1. Contract Testing (Happy Path)
To verify that the API strictly adheres to the OpenAPI contract using our external examples:

```bash
cd server
npm run test:contract
```
*This command loads the examples from `server/test_examples/` and ensures the API returns the correct data formats and status codes.*

### 2. Schema Resiliency (Fuzz) Testing
To perform generative testing where Specmatic automatically sends malformed payloads (nulls, missing fields, wrong data types) to surface backend stability issues:

```bash
cd server
npm run test:resilience
```
*Note: Some tests may fail or cause timeouts here because resiliency testing intentionally tries to break the server by bypassing client-side validation!*

---

## 📊 Viewing the Reports
After running either of the test scripts, Specmatic automatically generates visual HTML reports and structured JSON reports.

You can view the interactive HTML report by opening this file in your browser:
`server/reports/html/index.html`
