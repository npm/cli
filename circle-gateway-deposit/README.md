# Circle Gateway USDC deposit

Deposits USDC into the Circle Gateway Wallet contract from
`0x64291eebc576C331ED6e8890Af176C079B9F5C7e`, crediting that wallet's
unified Gateway balance. Once deposited, the balance can be burned on
the source chain and minted on any other Gateway-supported chain in
under 500 ms.

This is a self-contained, framework-free Node.js script — no part of
the npm CLI build depends on it.

## Why a script (and not a tool call from the agent)?

The cloud agent that wrote this code cannot execute the deposit itself:

- The Phantom MCP wallet requires an interactive browser sign-in that
  isn't available to a cloud agent (the MCP calls time out).
- No private key for `0x64291eebc576C331ED6e8890Af176C079B9F5C7e` is
  provisioned in the agent's environment (and shouldn't be — secrets
  for that wallet must stay with the user).

Run the script locally with the wallet's key to perform the deposit.

## Setup

```bash
cd circle-gateway-deposit
npm install
cp .env.example .env
# edit .env and set PRIVATE_KEY
```

The private key must derive to
`0x64291eebc576C331ED6e8890Af176C079B9F5C7e`; the script refuses to run
otherwise unless `--skip-depositor-check` is passed.

## Dry run (no broadcast)

Verify chain config, USDC balance, allowance, and gas balance before
sending anything on-chain:

```bash
PRIVATE_KEY=0x... npm run deposit:dry-run -- --amount 1 --chain base-sepolia
```

## Deposit

Testnet (recommended, default chain is `base-sepolia`):

```bash
PRIVATE_KEY=0x... npm run deposit -- --amount 1.5
PRIVATE_KEY=0x... npm run deposit -- --amount 25 --chain ethereum-sepolia
```

Mainnet (requires explicit opt-in):

```bash
PRIVATE_KEY=0x... ALLOW_MAINNET=1 npm run deposit -- --amount 100 --chain base
```

The script:

1. Validates the signer matches the expected depositor address.
2. Refuses to run against any mainnet chain unless `ALLOW_MAINNET=1`.
3. Checks USDC and native gas balances.
4. Approves the Gateway Wallet for the deposit amount (if needed).
5. Calls `deposit(usdc, amount)` on the Gateway Wallet contract.
6. Waits for both receipts and prints the tx hashes.

## Supported chains

| `--chain`              | Network | Domain |
|------------------------|---------|--------|
| `ethereum`             | mainnet | 0      |
| `avalanche`            | mainnet | 1      |
| `optimism`             | mainnet | 2      |
| `arbitrum`             | mainnet | 3      |
| `base`                 | mainnet | 6      |
| `polygon`              | mainnet | 7      |
| `unichain`             | mainnet | 10     |
| `ethereum-sepolia`     | testnet | 0      |
| `avalanche-fuji`       | testnet | 1      |
| `optimism-sepolia`     | testnet | 2      |
| `arbitrum-sepolia`     | testnet | 3      |
| `base-sepolia`         | testnet | 6      |
| `polygon-amoy`         | testnet | 7      |
| `unichain-sepolia`     | testnet | 10     |

Other Gateway-supported chains (Sonic, World Chain, Sei, HyperEVM,
Arc) can be added to `chains.js` if needed.

## Verifying the unified balance

After a deposit, query Gateway for the unified balance:

```bash
npm run balances                                # testnet
npm run balances -- --network mainnet
npm run balances -- --depositor 0xAbC...
```

This calls `POST /v1/balances` against the appropriate Gateway API
(testnet by default).

## Gateway contract addresses used

All EVM chains share the same Gateway addresses per network:

- Testnet Gateway Wallet:  `0x0077777d7EBA4688BDeF3E311b846F25870A19B9`
- Testnet Gateway Minter:  `0x0022222ABE238Cc2C7Bb1f21003F0a260052475B`
- Mainnet Gateway Wallet:  `0x77777777Dcc4d5A8B6E418Fd04D8997ef11000eE`
- Mainnet Gateway Minter:  `0x2222222d7164433c4C09B0b0D809a9b52C04C205`

Per-chain USDC addresses are in `chains.js`.

## Security

- Never commit `.env`. `.gitignore` covers `.env*`.
- The depositor address check (`--depositor`) guards against using the
  wrong private key.
- Mainnet runs require `ALLOW_MAINNET=1`.
- This script is "as is"; review carefully before running with real funds.
