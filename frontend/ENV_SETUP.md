# Environment Configuration

Create a `.env.local` file in the frontend directory with these variables:

```bash
# GenLayer RPC URL
NEXT_PUBLIC_GENLAYER_RPC=http://localhost:8545

# Contract Address (get this after deploying JusticeOracle.py)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Network
NEXT_PUBLIC_NETWORK=testnet
```

## After Deploying Contract

1. Deploy `JusticeOracle.py` to GenLayer Studio
2. Copy the contract address
3. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`
4. Restart the Next.js dev server
