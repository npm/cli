// Circle Gateway contract addresses and chain config.
// Source: Circle Gateway skill reference (use-gateway/references/config.md).
// Gateway Wallet/Minter addresses are identical across all EVM chains per network.

import {
  arbitrum,
  arbitrumSepolia,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  sepolia,
  unichain,
  unichainSepolia,
} from "viem/chains";

export const GATEWAY_API = {
  mainnet: "https://gateway-api.circle.com/v1",
  testnet: "https://gateway-api-testnet.circle.com/v1",
};

export const EVM_GATEWAY_WALLET = {
  mainnet: "0x77777777Dcc4d5A8B6E418Fd04D8997ef11000eE",
  testnet: "0x0077777d7EBA4688BDeF3E311b846F25870A19B9",
};

export const EVM_GATEWAY_MINTER = {
  mainnet: "0x2222222d7164433c4C09B0b0D809a9b52C04C205",
  testnet: "0x0022222ABE238Cc2C7Bb1f21003F0a260052475B",
};

// Per-chain USDC + RPC config. Domain IDs come from the Gateway skill table.
export const CHAINS = {
  // ---- Mainnet ----
  ethereum: {
    network: "mainnet",
    domain: 0,
    chain: mainnet,
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    rpc: "https://ethereum-rpc.publicnode.com",
  },
  avalanche: {
    network: "mainnet",
    domain: 1,
    chain: avalanche,
    usdc: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    rpc: "https://avalanche-c-chain-rpc.publicnode.com",
  },
  optimism: {
    network: "mainnet",
    domain: 2,
    chain: optimism,
    usdc: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
    rpc: "https://optimism-rpc.publicnode.com",
  },
  arbitrum: {
    network: "mainnet",
    domain: 3,
    chain: arbitrum,
    usdc: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    rpc: "https://arbitrum-one-rpc.publicnode.com",
  },
  base: {
    network: "mainnet",
    domain: 6,
    chain: base,
    usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    rpc: "https://base-rpc.publicnode.com",
  },
  polygon: {
    network: "mainnet",
    domain: 7,
    chain: polygon,
    usdc: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    rpc: "https://polygon-rpc.com",
  },
  unichain: {
    network: "mainnet",
    domain: 10,
    chain: unichain,
    usdc: "0x078D782b760474a361dDA0AF3839290b0EF57AD6",
    rpc: "https://mainnet.unichain.org",
  },

  // ---- Testnet ----
  "ethereum-sepolia": {
    network: "testnet",
    domain: 0,
    chain: sepolia,
    usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    rpc: "https://ethereum-sepolia-rpc.publicnode.com",
  },
  "avalanche-fuji": {
    network: "testnet",
    domain: 1,
    chain: avalancheFuji,
    usdc: "0x5425890298aed601595a70AB815c96711a31Bc65",
    rpc: "https://avalanche-fuji-c-chain-rpc.publicnode.com",
  },
  "optimism-sepolia": {
    network: "testnet",
    domain: 2,
    chain: optimismSepolia,
    usdc: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
    rpc: "https://optimism-sepolia-rpc.publicnode.com",
  },
  "arbitrum-sepolia": {
    network: "testnet",
    domain: 3,
    chain: arbitrumSepolia,
    usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    rpc: "https://arbitrum-sepolia-rpc.publicnode.com",
  },
  "base-sepolia": {
    network: "testnet",
    domain: 6,
    chain: baseSepolia,
    usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    rpc: "https://base-sepolia-rpc.publicnode.com",
  },
  "polygon-amoy": {
    network: "testnet",
    domain: 7,
    chain: polygonAmoy,
    usdc: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
    rpc: "https://polygon-amoy-bor-rpc.publicnode.com",
  },
  "unichain-sepolia": {
    network: "testnet",
    domain: 10,
    chain: unichainSepolia,
    usdc: "0x31d0220469e10c4E71834a79b1f276d740d3768F",
    rpc: "https://sepolia.unichain.org",
  },
};

export function getChainConfig(name) {
  const cfg = CHAINS[name];
  if (!cfg) {
    const supported = Object.keys(CHAINS).join(", ");
    throw new Error(`Unknown chain "${name}". Supported: ${supported}`);
  }
  return {
    ...cfg,
    gatewayWallet: EVM_GATEWAY_WALLET[cfg.network],
    gatewayMinter: EVM_GATEWAY_MINTER[cfg.network],
    apiUrl: GATEWAY_API[cfg.network],
  };
}
