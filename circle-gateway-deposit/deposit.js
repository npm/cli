#!/usr/bin/env node
// Deposit USDC into the Circle Gateway Wallet contract on an EVM chain.
// Credits the depositor's unified Gateway balance.
//
// Usage:
//   PRIVATE_KEY=0x... node deposit.js --amount 1.5 --chain base-sepolia
//   PRIVATE_KEY=0x... node deposit.js --amount 1.5 --chain base-sepolia --dry-run
//
// Notes:
//   - "Deposit" in Circle Gateway means transferring USDC into the Gateway Wallet
//     contract; the deposit credits the SIGNER's unified balance.
//   - This script verifies the signer's address matches EXPECTED_DEPOSITOR before
//     broadcasting (so you can confirm you're using the intended wallet).

import process from "node:process";
import { parseArgs } from "node:util";
import {
  createPublicClient,
  createWalletClient,
  erc20Abi,
  formatUnits,
  http,
  parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { getChainConfig } from "./chains.js";

// The wallet that should make the deposit. The script refuses to run unless
// PRIVATE_KEY's derived address matches this. Override via --depositor if needed.
const EXPECTED_DEPOSITOR = "0x64291eebc576C331ED6e8890Af176C079B9F5C7e";

// Keep gas caps explicit so wallet providers don't overestimate.
const APPROVE_GAS_LIMIT = 120_000n;
const DEPOSIT_GAS_LIMIT = 350_000n;

// Gateway Wallet ABI — only the `deposit(token, value)` function.
const gatewayWalletAbi = [
  {
    type: "function",
    name: "deposit",
    inputs: [
      { name: "token", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
];

function parseCliArgs() {
  const { values } = parseArgs({
    options: {
      amount: { type: "string" },
      chain: { type: "string", default: "base-sepolia" },
      depositor: { type: "string", default: EXPECTED_DEPOSITOR },
      "skip-depositor-check": { type: "boolean", default: false },
      "dry-run": { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
    allowPositionals: false,
  });
  return values;
}

function printHelp() {
  console.log(`Circle Gateway USDC deposit

Required env:
  PRIVATE_KEY    Hex-encoded private key for the depositor wallet (with 0x prefix).

Options:
  --amount <USDC>           Amount of USDC to deposit (e.g. 1.5). Required unless --help.
  --chain <name>            Target chain (default: base-sepolia).
                            Testnet: ethereum-sepolia, avalanche-fuji, optimism-sepolia,
                                     arbitrum-sepolia, base-sepolia, polygon-amoy,
                                     unichain-sepolia
                            Mainnet: ethereum, avalanche, optimism, arbitrum, base,
                                     polygon, unichain
  --depositor <0x...>       Expected depositor address (default: ${EXPECTED_DEPOSITOR}).
  --skip-depositor-check    Don't enforce the depositor address check.
  --dry-run                 Print the plan and check balances/allowance, but don't broadcast.
  -h, --help                Show this help.

Examples:
  PRIVATE_KEY=0x... node deposit.js --amount 1.5
  PRIVATE_KEY=0x... node deposit.js --amount 25 --chain ethereum-sepolia
  PRIVATE_KEY=0x... node deposit.js --amount 0.1 --chain base-sepolia --dry-run
`);
}

async function main() {
  const args = parseCliArgs();

  if (args.help) {
    printHelp();
    return;
  }

  if (!args.amount) {
    console.error("Error: --amount is required. Use --help for usage.");
    process.exit(1);
  }

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || !/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
    console.error(
      "Error: PRIVATE_KEY env var must be set to a 0x-prefixed 32-byte hex string."
    );
    process.exit(1);
  }

  const config = getChainConfig(args.chain);
  const account = privateKeyToAccount(privateKey);

  if (
    !args["skip-depositor-check"] &&
    account.address.toLowerCase() !== args.depositor.toLowerCase()
  ) {
    console.error(
      `Error: PRIVATE_KEY corresponds to ${account.address}, but expected ${args.depositor}.\n` +
        "Pass --skip-depositor-check to override, or --depositor to change the expected address."
    );
    process.exit(2);
  }

  let depositAmount;
  try {
    depositAmount = parseUnits(args.amount, 6);
  } catch (err) {
    console.error(`Error parsing amount "${args.amount}": ${err.message}`);
    process.exit(1);
  }
  if (depositAmount <= 0n) {
    console.error("Error: --amount must be greater than 0.");
    process.exit(1);
  }

  // Block mainnet without explicit opt-in to avoid accidental fund movement.
  if (config.network === "mainnet" && !process.env.ALLOW_MAINNET) {
    console.error(
      `Refusing to run on ${args.chain} (mainnet) without ALLOW_MAINNET=1 in the environment.\n` +
        "Re-run with ALLOW_MAINNET=1 ONLY after confirming the amount, chain, and depositor."
    );
    process.exit(3);
  }

  const publicClient = createPublicClient({
    chain: config.chain,
    transport: http(config.rpc),
  });
  const walletClient = createWalletClient({
    account,
    chain: config.chain,
    transport: http(config.rpc),
  });

  console.log("Circle Gateway USDC deposit");
  console.log("===========================");
  console.log(`Chain:           ${args.chain} (${config.chain.name}, id ${config.chain.id})`);
  console.log(`Network:         ${config.network}`);
  console.log(`Domain ID:       ${config.domain}`);
  console.log(`USDC:            ${config.usdc}`);
  console.log(`Gateway Wallet:  ${config.gatewayWallet}`);
  console.log(`Depositor:       ${account.address}`);
  console.log(`Amount:          ${args.amount} USDC (${depositAmount} base units)`);
  console.log(`Dry run:         ${args["dry-run"] ? "yes" : "no"}`);
  console.log("");

  const [usdcBalance, allowance, nativeBalance] = await Promise.all([
    publicClient.readContract({
      address: config.usdc,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [account.address],
    }),
    publicClient.readContract({
      address: config.usdc,
      abi: erc20Abi,
      functionName: "allowance",
      args: [account.address, config.gatewayWallet],
    }),
    publicClient.getBalance({ address: account.address }),
  ]);

  console.log(`USDC balance:    ${formatUnits(usdcBalance, 6)} USDC`);
  console.log(`Allowance:       ${formatUnits(allowance, 6)} USDC`);
  console.log(
    `Native balance:  ${formatUnits(nativeBalance, 18)} ${config.chain.nativeCurrency.symbol}`
  );
  console.log("");

  if (usdcBalance < depositAmount) {
    console.error(
      `Insufficient USDC: have ${formatUnits(usdcBalance, 6)}, need ${args.amount}.`
    );
    process.exit(4);
  }
  if (nativeBalance === 0n) {
    console.error(
      `Wallet has 0 ${config.chain.nativeCurrency.symbol}. Fund the wallet for gas before depositing.`
    );
    process.exit(5);
  }

  if (args["dry-run"]) {
    const needsApproval = allowance < depositAmount;
    console.log(
      needsApproval
        ? "Dry run OK. Would send: (1) approve, (2) deposit."
        : "Dry run OK. Allowance is sufficient. Would send: (1) deposit only."
    );
    return;
  }

  if (allowance < depositAmount) {
    console.log("Step 1/2: approving USDC for Gateway Wallet...");
    const approveTx = await walletClient.writeContract({
      address: config.usdc,
      abi: erc20Abi,
      functionName: "approve",
      args: [config.gatewayWallet, depositAmount],
      gas: APPROVE_GAS_LIMIT,
    });
    console.log(`  approve tx: ${approveTx}`);
    const approveReceipt = await publicClient.waitForTransactionReceipt({
      hash: approveTx,
    });
    if (approveReceipt.status !== "success") {
      console.error("  approve reverted. Aborting.");
      process.exit(6);
    }
    console.log("  approve confirmed.\n");
  } else {
    console.log("Step 1/2: approval skipped (allowance already sufficient).\n");
  }

  console.log("Step 2/2: depositing into Gateway Wallet...");
  const depositTx = await walletClient.writeContract({
    address: config.gatewayWallet,
    abi: gatewayWalletAbi,
    functionName: "deposit",
    args: [config.usdc, depositAmount],
    gas: DEPOSIT_GAS_LIMIT,
  });
  console.log(`  deposit tx: ${depositTx}`);
  const depositReceipt = await publicClient.waitForTransactionReceipt({
    hash: depositTx,
  });
  if (depositReceipt.status !== "success") {
    console.error("  deposit reverted.");
    process.exit(7);
  }
  console.log("  deposit confirmed.");
  console.log("");
  console.log(
    `Done. ${args.amount} USDC deposited into Circle Gateway from ${account.address} on ${args.chain}.`
  );
  console.log(
    "Your unified Gateway balance should be available across all Gateway-supported chains within ~30s."
  );
  console.log(
    `Verify with: POST ${config.apiUrl}/balances  (see balances.js for a helper).`
  );
}

main().catch((err) => {
  console.error("Fatal error:");
  console.error(err?.shortMessage || err?.message || err);
  if (err?.cause) console.error("Cause:", err.cause);
  process.exit(99);
});
