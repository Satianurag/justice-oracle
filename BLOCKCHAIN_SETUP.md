# 🔗 GenLayer Blockchain Setup Guide

## What is GenLayer?

GenLayer is a specialized blockchain for **Intelligent Contracts** - smart contracts that can:
- Run AI/LLM reasoning
- Make subjective decisions
- Scrape web data
- Store vectors for semantic search
- Reach consensus on non-deterministic outputs

**Perfect for:** AI arbitration, content moderation, credit scoring, anything requiring "judgment"

---

## Quick Start (5 minutes)

### 1. Access GenLayer Studio

**URL:** https://studio.genlayer.com/

**What is it?**
- Web-based IDE for GenLayer contracts
- Built-in simulator
- Deploy to testnet with one click
- Free test tokens included

### 2. Get Testnet Tokens (FREE)

**Option A: Automatic (Recommended)**
- Just sign up for GenLayer Studio
- Test tokens provided automatically
- No payment needed

**Option B: Faucet**
- If you need more tokens: https://faucet.genlayer.com/
- Enter your wallet address
- Receive 1000 test tokens instantly

### 3. Deploy Justice Oracle Contract

**In GenLayer Studio:**

```python
# 1. Click "New Contract"
# 2. Upload or paste contracts/JusticeOracle.py
# 3. Click "Deploy to Testnet"
# 4. Wait for confirmation
# 5. Copy contract address
```

**Example:**
```
✅ Contract deployed!
Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Network: GenLayer Testnet
Tokens used: ~50 (from your free 1000)
```

---

## Configure Your Frontend

### Step 1: Create Environment File

```bash
cd /home/sati/Desktop/justice-oracle/frontend

# Create .env.local
nano .env.local
```

### Step 2: Add Configuration

```bash
# GenLayer RPC Endpoint
NEXT_PUBLIC_GENLAYER_RPC=https://studio.genlayer.com/api

# Your deployed contract address (from Studio)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

# Network
NEXT_PUBLIC_NETWORK=testnet
```

**Replace** `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb` with YOUR actual contract address!

### Step 3: Restart Frontend

```bash
npm run dev
```

Open http://localhost:3000 - you should see:
- ✅ Green "LIVE" indicator in sidebar
- ✅ Stats loading from blockchain
- ✅ Can file disputes

---

## Understanding GenLayer Costs

### Test Tokens (FREE)
- **File Dispute:** ~10 tokens (for staking)
- **Submit Evidence:** ~2 tokens
- **Resolve Dispute:** ~5 tokens (AI processing)
- **You get:** 1000 free tokens on signup

### Real Deployment (Future)
- When GenLayer launches mainnet
- You'll need real tokens
- But for hackathon: **100% FREE testnet**

---

## RPC Endpoints

### Testnet (Use This)
```
https://studio.genlayer.com/api
```

### Local Development
```
http://localhost:8545
```

### Mainnet (Not live yet)
```
TBD - Coming soon
```

---

## Wallet Setup (Optional)

For advanced usage, you can use a GenLayer wallet:

### Option 1: Browser Wallet
- Install GenLayer wallet extension
- Create account
- Switch to testnet

### Option 2: Studio Built-in
- GenLayer Studio has built-in wallet
- No extension needed
- Perfect for development

**For this hackathon:** Studio is enough, no separate wallet needed!

---

## Test Your Deployment

### In GenLayer Studio Simulator:

```python
# Test filing a dispute
dispute_id = contract.file_dispute(
    defendant_address="0x1234567890123456789012345678901234567890",
    case_description="Test dispute for hackathon demo - freelancer didn't deliver work as specified in contract.",
    evidence_urls=["https://github.com/test/issue"]
)

print(f"Dispute filed: #{dispute_id}")

# Test getting stats
stats = contract.get_stats()
print(f"Total disputes: {stats['total_disputes']}")
print(f"Min stake: {stats['min_stake']}")
```

### In Your Frontend:

1. Open http://localhost:3000
2. Click "File Dispute"
3. Fill form and submit
4. Watch transaction toast
5. Check "Disputes" page for new entry

---

## Troubleshooting

### "Contract not configured"
**Problem:** Frontend can't find contract address

**Fix:**
```bash
# Check .env.local exists
ls frontend/.env.local

# Verify content
cat frontend/.env.local

# Make sure it has all 3 variables
# Restart: npm run dev
```

### "Failed to load disputes"
**Problem:** RPC connection issue

**Fix:**
1. Check RPC URL in .env.local
2. Verify contract deployed: https://studio.genlayer.com/
3. Try different RPC: `https://testnet-rpc.genlayer.com/`

### "Transaction failed"
**Problem:** Not enough test tokens

**Fix:**
1. Go to https://faucet.genlayer.com/
2. Enter your address
3. Get more free tokens

---

## GenLayer vs Other Blockchains

| Feature | GenLayer | Ethereum | Solana |
|---------|----------|----------|--------|
| AI/LLM Support | ✅ Native | ❌ Off-chain | ❌ Off-chain |
| Web Scraping | ✅ Built-in | ❌ Oracles | ❌ Oracles |
| Vector Search | ✅ VectorStore | ❌ External DB | ❌ External DB |
| Subjective Logic | ✅ Yes | ❌ Deterministic | ❌ Deterministic |
| Python Contracts | ✅ Yes | ❌ Solidity | ❌ Rust |

**Why GenLayer for Justice Oracle?**
- AI verdict reasoning ✅
- Evidence credibility scoring ✅
- Legal precedent search ✅
- Web evidence scraping ✅

**Impossible on traditional blockchains!**

---

## Resources

**Official:**
- Website: https://genlayer.com/
- Docs: https://docs.genlayer.com/
- Studio: https://studio.genlayer.com/
- Discord: https://discord.gg/genlayer

**Your Project:**
- Contract: `/contracts/JusticeOracle.py`
- Frontend: `/frontend/`
- Demo Guide: `/DEMO_GUIDE.md`

---

## Ready to Deploy?

**Checklist:**
- [ ] GenLayer Studio account created
- [ ] Contract deployed to testnet
- [ ] Contract address copied
- [ ] `.env.local` configured
- [ ] Frontend running (npm run dev)
- [ ] Green "LIVE" indicator showing
- [ ] Can file test dispute

**Time needed:** 5-10 minutes  
**Cost:** $0 (100% free testnet)

---

## Next Steps

1. **Deploy contract** → GenLayer Studio
2. **Run seed script** → `seed_demo_data.py`
3. **Test frontend** → File a dispute
4. **Record demo** → 2-minute video
5. **Submit hackathon** → Win! 🏆

**You're building on the cutting edge of blockchain AI!** 🚀
