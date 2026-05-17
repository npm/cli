#!/usr/bin/env node
// Query Circle Gateway unified balance for a depositor across all supported domains.
//
// Usage:
//   node balances.js                                # testnet, default depositor
//   node balances.js --depositor 0xAbc... --network testnet
//   node balances.js --network mainnet

import process from "node:process";
import { parseArgs } from "node:util";

import { GATEWAY_API } from "./chains.js";

const DEFAULT_DEPOSITOR = "0x64291eebc576C331ED6e8890Af176C079B9F5C7e";

// EVM domain IDs from the Gateway skill. Solana would use base58 keys, so
// keep this script EVM-only for simplicity.
const EVM_DOMAINS = {
  mainnet: [
    { name: "Ethereum", domain: 0 },
    { name: "Avalanche", domain: 1 },
    { name: "OP Mainnet", domain: 2 },
    { name: "Arbitrum", domain: 3 },
    { name: "Base", domain: 6 },
    { name: "Polygon PoS", domain: 7 },
    { name: "Unichain", domain: 10 },
    { name: "Sonic", domain: 13 },
    { name: "World Chain", domain: 14 },
    { name: "Sei", domain: 16 },
    { name: "HyperEVM", domain: 19 },
  ],
  testnet: [
    { name: "Ethereum Sepolia", domain: 0 },
    { name: "Avalanche Fuji", domain: 1 },
    { name: "OP Sepolia", domain: 2 },
    { name: "Arbitrum Sepolia", domain: 3 },
    { name: "Base Sepolia", domain: 6 },
    { name: "Polygon Amoy", domain: 7 },
    { name: "Unichain Sepolia", domain: 10 },
    { name: "Sonic Testnet", domain: 13 },
    { name: "World Chain Sepolia", domain: 14 },
    { name: "Sei Atlantic", domain: 16 },
    { name: "HyperEVM Testnet", domain: 19 },
    { name: "Arc Testnet", domain: 26 },
  ],
};

async function main() {
  const { values } = parseArgs({
    options: {
      depositor: { type: "string", default: DEFAULT_DEPOSITOR },
      network: { type: "string", default: "testnet" },
      help: { type: "boolean", short: "h", default: false },
    },
  });

  if (values.help) {
    console.log(`Query Circle Gateway unified balance.

Options:
  --depositor <0x...>   Depositor address (default: ${DEFAULT_DEPOSITOR})
  --network <name>      testnet (default) or mainnet
  -h, --help            Show this help.
`);
    return;
  }

  const network = values.network;
  if (!GATEWAY_API[network]) {
    console.error(`Error: --network must be "testnet" or "mainnet" (got "${network}").`);
    process.exit(1);
  }
  const apiUrl = `${GATEWAY_API[network]}/balances`;
  const domains = EVM_DOMAINS[network];

  const body = {
    token: "USDC",
    sources: domains.map((d) => ({ domain: d.domain, depositor: values.depositor })),
  };

  console.log(`Querying ${apiUrl}`);
  console.log(`Depositor: ${values.depositor}`);
  console.log("");

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error(`HTTP ${res.status} ${res.statusText}`);
    console.error(await res.text());
    process.exit(2);
  }

  const data = await res.json();
  const byDomain = new Map(
    (data.balances || []).map((b) => [b.domain, b.balance])
  );

  let total = 0;
  for (const { name, domain } of domains) {
    const balance = byDomain.get(domain) ?? "0";
    const num = Number(balance);
    if (Number.isFinite(num)) total += num;
    const pad = name.padEnd(22);
    console.log(`  ${pad} domain ${String(domain).padStart(2)}  ${balance} USDC`);
  }
  console.log("");
  console.log(`Unified balance (EVM only): ${total.toFixed(6)} USDC`);
}

main().catch((err) => {
  console.error("Fatal error:", err?.message || err);
  process.exit(99);
});
